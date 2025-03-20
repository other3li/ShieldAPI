const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware للتحقق من التوكن
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

    jwt.verify(token.replace("Bearer ", ""), JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Forbidden - Invalid token" });
        req.user = user;
        next();
    });
};

// ✅ 1️⃣ تسجيل مستخدم جديد (SignUp)
app.post("/signup", async (req, res) => {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
        return res.status(400).json({ message: "يرجى إدخال جميع الحقول" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query("INSERT INTO users (name, username, password) VALUES (?, ?, ?)",
        [name, username, hashedPassword],
        (err) => {
            if (err) return res.status(500).json({ message: "خطأ في التسجيل", error: err });
            res.status(201).json({ message: "تم إنشاء المستخدم بنجاح!" });
        }
    );
});

// ✅ 2️⃣ تسجيل الدخول (Login) والحصول على JWT
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "يرجى إدخال جميع الحقول" });
    }

    db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
        if (err) return res.status(500).json({ message: "خطأ في تسجيل الدخول" });
        if (results.length === 0) return res.status(401).json({ message: "اسم المستخدم غير موجود" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "كلمة المرور غير صحيحة" });

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "10m" });
        res.json({ token });
    });
});

// ✅ 3️⃣ تحديث بيانات المستخدم (يحتاج إلى JWT)
app.put("/users/:id", authenticateToken, (req, res) => {
    const { name, username } = req.body;
    const userId = req.params.id;
    db.query("UPDATE users SET name = ?, username = ? WHERE id = ?", [name, username, userId],
        (err) => {
            if (err) return res.status(500).json({ message: "خطأ في التحديث", error: err });
            res.json({ message: "تم تحديث المستخدم بنجاح" });
        }
    );
});

// ✅ 4️⃣ إضافة منتج جديد (يحتاج إلى JWT)
app.post("/products", authenticateToken, (req, res) => {
    const { pname, description, price, stock } = req.body;
    db.query("INSERT INTO products (pname, description, price, stock, created_at) VALUES (?, ?, ?, ?, NOW())",
        [pname, description, price, stock],
        (err) => {
            if (err) return res.status(500).json({ message: "خطأ في إضافة المنتج", error: err });
            res.status(201).json({ message: "تم إضافة المنتج بنجاح!" });
        }
    );
});

// ✅ 5️⃣ جلب جميع المنتجات
app.get("/products", authenticateToken, (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) return res.status(500).json({ message: "خطأ في جلب المنتجات" });
        res.json(results);
    });
});

// ✅ 6️⃣ جلب منتج واحد حسب ID
app.get("/products/:pid", authenticateToken, (req, res) => {
    db.query("SELECT * FROM products WHERE pid = ?", [req.params.pid], (err, results) => {
        if (err) return res.status(500).json({ message: "خطأ في جلب المنتج" });
        if (results.length === 0) return res.status(404).json({ message: "المنتج غير موجود" });
        res.json(results[0]);
    });
});

// ✅ 7️⃣ تحديث منتج معين
app.put("/products/:pid", authenticateToken, (req, res) => {
    const { pname, description, price, stock } = req.body;
    db.query("UPDATE products SET pname = ?, description = ?, price = ?, stock = ? WHERE pid = ?",
        [pname, description, price, stock, req.params.pid],
        (err) => {
            if (err) return res.status(500).json({ message: "خطأ في تحديث المنتج" });
            res.json({ message: "تم تحديث المنتج بنجاح" });
        }
    );
});

// ✅ 8️⃣ حذف منتج معين
app.delete("/products/:pid", authenticateToken, (req, res) => {
    db.query("DELETE FROM products WHERE pid = ?", [req.params.pid], (err) => {
        if (err) return res.status(500).json({ message: "خطأ في حذف المنتج" });
        res.json({ message: "تم حذف المنتج بنجاح" });
    });
});

// 🚀 تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
