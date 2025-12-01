let db = require('./db.config')
let path = require('path')
let express = require('express')
let cors = require('cors')
let nodemail = require('nodemailer')
require('dotenv').config();
let bcrypt = require('bcrypt')
let multer = require('multer')
let jwt = require('jsonwebtoken')
const { decode } = require('punycode')
const { error } = require('console')
// const { text } = require('stream/consumers')

let app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
let secretkey = "myprojectcode"
let otpstorge = {}
let saltRounds = 10;

let generateJwt = (id, role) => {
    return jwt.sign({ id, role }, secretkey, { expiresIn: '7d' })
}

app.get('/citydata', (req, res) => {
    let sqlQuery = "SELECT * FROM cities";
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message: "Database Issue" });
        } else {
            console.log("City table Data:", result);
            res.status(200).json(result);
        }
    });
});

// let verifytoken = async (req, res, next) => {
//     // console.log("verifytoken",req.headers.authorization)
//     let token = req.headers.authorization.split(" ")[1];
//     console.log(token);
//     if (!token) return res.status(401).json({ error: "Unauthorized" })
//     jwt.verify(token, scretkey, (err, decode) => {
//         if (err) console.log(err)
//         else {
//             req.user = decode
//             next()
//         }
//     })
// }

let verifytoken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }

    // "Bearer <token>" format
    const token = authHeader.split(" ")[1];
    console.log(token)
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    jwt.verify(token, secretkey, (err, decoded) => {
        if (err) {
            console.error("JWT verify error:", err);
            return res.status(403).json({ error: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};


const authorizeRoles = roles => async (req, res, next) => {
    console.log(req.user)
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Access denied" })
    next()
}

app.post('/Signup', (req, res) => {
    let { fname, lname, emailid, password, mobile, cityid } = req.body;

    let sqlQuery = `select * from users where emailid=?`
    db.query(sqlQuery, [emailid], async (err, result) => {
        if (err) console.log(err)
        else {

            if (result.length > 0) {
                res.status(400).json({ message: "Emailid already exist" })
                return
            }
            else {
                const otp = Math.floor(100000 + Math.random() * 900000);
                otpstorge[emailid] = { otp, expiresAt: Date.now() + 2 * 60 * 1000, userDetails: { fname, lname, password, emailid, mobile, cityid } }
                console.log(otp)

                const transporter = nodemail.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                })
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: emailid,
                    subject: `Your OTP Code`,
                    text: `Your OTP is ${otp}.It is valid for 2 minutes`
                };
                await transporter.sendMail(mailOptions)
                return res.status(200).json({ message: "Otp sent" })
            }
        }
    });

});

app.post('/verifyUserotp', (req, res) => {
    let { otp, email } = req.body
    // console.log(req.body)
    // console.log(emailid)
    // console.log(otpstorge[emailid].otp == otp)

    // console.log("Income emails",email)
    // console.log("OTP Storage:",otpstorge[email])

    if (!otpstorge[email]) {
        return
        res.status(400).json({ message: "Invalid OTP" })
    }
    if (otpstorge[email].expiresAt < Date.now()) {
        delete otpstorge[email];
        return res.status(400).json({ message: "OTP Expired" });
    }
    if (otpstorge[email].otp == otp) {
        let { fname, lname, emailid, password, mobile, cityid } = otpstorge[email].userDetails;
        console.log(otpstorge[email].userDetails)
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) console.log(err)
            else {
                let sqlQuery = `insert into users(fname, lname, emailid, password, mobile, cityid) values(?,?,?,?,?,?)`;
                db.query(sqlQuery, [fname, lname, emailid, hash, mobile, cityid], (err) => {

                    if (err) {
                        console.log(err)
                        res.status(500).json({ message: "Database Issue" })
                    }
                    else res.status(200).json({ message: "Data inserted" })
                })
            }
        });
    }
})

app.get('/catgryList', (req, res) => {
    let sqlQuery = `SELECT categoryid, categryname  FROM category WHERE categoryid IN (SELECT DISTINCT categoryid FROM products)`
    db.query(sqlQuery, (err, result) => {
        if (err)

            res.status(500).json({ message: "Database Issue" })

        else res.status(200).json(result)
    })
})



// app.get('/catgryList', (req, res) => {
//     let sqlQuery = `SELECT categoryid, categryname FROM category`;
//     db.query(sqlQuery, (err, result) => {
//         if (err) {
//             console.log("DB Error:", err);
//             return res.status(500).json({ message: "Database Issue" });
//         }
//         console.log("Categories:", result);
//         res.status(200).json(result);
//     });
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const stringval = "E-comm_Images"
        const extension = path.extname(file.originalname)
        const datetime = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14)
        const randomNum = Math.floor(Math.random() * 1000000)
        const uniqueFilename = `${stringval}_${datetime}_${randomNum}${extension}`;
        cb(null, uniqueFilename)
    }
})

const upload = multer({ storage })


app.post('/adminlogin', (req, res) => {
    let { emailid, password } = req.body
    let sqlQuery = "select * from admin where email=? AND password=?"

    db.query(sqlQuery, [emailid, password], async (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: "Database Issue 123" })
        }
        else {
            if (result.length <= 0) {
                return res.status(404).json({ message: "User Not Found" })
            }
            else {
                let UserPassword = result[0]

                // let checkpwd = await bcrypt.compare(password, UserPassword.password)
                // if (checkpwd != true) {
                //     return res.status(404).json({ message: " invalid password " })

                // }
                let token = generateJwt(UserPassword.adminid, UserPassword.role)
                res.status(200).json({ token: token, role: UserPassword.role })
            }

        }
    })
})

app.post('/signin', (req, res) => {
    let { emailid, password } = req.body
    let sqlQuery = "select * from users where emailid=?"

    db.query(sqlQuery, [emailid], async (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: "Database Issue" })
        }
        else {
            if (result.length <= 0) {
                return res.status(404).json({ message: "User Not Found" })
            }
            else {
                let UserPassword = result[0]

                let checkpwd = await bcrypt.compare(password, UserPassword.password)
                if (checkpwd != true) {
                    return res.status(404).json({ message: " invalid password " })

                }
                let token = generateJwt(UserPassword.id, UserPassword.role)
                res.status(200).json({ token: token, role: UserPassword.role })
            }

            // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
            // eyJpZCI6OSwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTQ1ODIyMjgsImV4cCI6MTc1NDU4NTgyOH0
            // .MBUIda42iRlPTZ_l-8aftsPbmpo2FIeof4ZYfl8-RR0

        }
    })
})

app.post('/addProduct', upload.array('images'), verifytoken, authorizeRoles(["admin"]), (req, res) => {
    let { categoryid, pname, model, price } = req.body
    let pimages = req.files.map((file => file.filename))
    console.log(pimages)

    let sqlQuery = ` insert into products(categoryid,pname, pmodel, price) values(?,?,?,?)`;

    db.query(sqlQuery, [categoryid, pname, model, price], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message: "Database Issue" })

        }
        else {
            let productId = result.insertId;
            console.log("Current product", productId)

            pimages.forEach(pimg => {
                let pid = productId

                let imgQuery = `insert into pimages(imgpath,pid) values(?,?)`;

                db.query(imgQuery, [pimg, pid], (err) => {
                    if (err) console.log(err)

                })

            })
            res.status(200).json({ message: "Product Added" })
        }
    })
})

app.get('/displayProducts', (req, res) => {
    let sql = `select p.productid,
 p.pname,
 p.pmodel, p.price,
 c.categryname,
 pimg.imgpath

from products as p inner join
category as c on c.categoryid = p.categoryid inner join (SELECT pid, min(imgid)  as imageid from pimages
group by pid) as firstimage
on p.productid= firstimage.pid
inner join pimages as pimg on firstimage.imageid=pimg.imgid;`

    db.query(sql, (err, result) => {
        if (err) res.status(500).json({ message: "data base issue" })
        else res.status(200).json(result)
    })
})

app.get('/productData/:id', (req, res) => {
    let id = req.params.id
    let sql = `select * from products where productid=?`
    db.query(sql, [id], (err, result) => {
        if (err) res.status(500).json({ message: "data base issue" })
        else res.status(200).json(result)
    })

})


app.get('/productImage/:id', (req, res) => {
    let id = req.params.id
    let sql = `select * from pimages where pid=?`
    db.query(sql, [id], (err, result) => {
        if (err) res.status(500).json({ message: "data base issue" })
        else res.status(200).json(result)
    })

})

app.post('/addtoCart', verifytoken, authorizeRoles(["user"]), (req, res) => {

    let cartitems = Array.isArray(req.body) ? req.body : [req.body];
    let userId = req.user.id;
    console.log(userId)
    cartitems.forEach(data => {
        const productId = data.productid;
        const quantity = data.quantity;

        let selectQuery = `SELECT * FROM cartproduct WHERE userid=? AND productid=?`;
        db.query(selectQuery, [userId, productId], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Database error" });
            }

            if (result.length > 0) {
                let updateQuery = `UPDATE cartproduct SET quantity = quantity + ? WHERE userid=? AND productid=?`;
                db.query(updateQuery, [quantity, userId, productId], (err) => {
                    if (err) console.log(err);
                });
            } else {
                let insertQuery = ` INSERT INTO cartproduct(userid, productid, quantity) VALUES(?,?,?)`;
                db.query(insertQuery, [userId, productId, quantity], (err) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: "Database Issue" });
                    }
                });
            }
        });
    });

    res.status(200).json({ message: "Cart processed successfully" });
});

app.get('/cartProducts', verifytoken, authorizeRoles(["user"]), (req, res) => {
    let userId = req.user.id;
    // productid, categoryid, pname, pmodel, price, pdesc, status
    // imgid, imgpath, pid
    let query = `
        SELECT c.catid,c.userid,
            c.productid, 
            c.quantity, 
            p.pname, 
            p.price, 
            img.imgpath
        FROM cartproduct as c
        inner join products p ON c.productid = p.productid
        inner JOIN (
            SELECT pid, MIN(imgid) as first_imgid
            FROM pimages
            GROUP BY pid
        ) as firstimg ON p.productid = firstimg.pid
        inner JOIN pimages as  img ON firstimg.first_imgid = img.imgid
        WHERE c.userid =?
    `;

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(200).json(result);
    });
});

app.post('/order',verifytoken, authorizeRoles(["user"]), (req, res) => {
let userId = req.user.id;
    const { quantity, date, totalamt, cartitems } = req.body;
    console.log("Request body:", req.body);
    console.log("useid:",userId);

    if (!cartitems || !Array.isArray(cartitems)) {
        return res.status(400).json({ message: "cartitems is required and must be an array" });
    }

    let sqlQuery = `INSERT INTO orders(userid, quantity, date, totalamt) VALUES (?, ?, ?, ?)`;
    

    db.query(sqlQuery, [userId, quantity, date, totalamt], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database Issue" });
        }
        else{

        const orderid = result.insertId;
        console.log("Inserted order id:", orderid);

        // let completed = 0; // counter to track finished cart items
        // const totalItems = cartitems.length;

        cartitems.forEach(item => {
            const { productid, quantity} = item;
            let sqlItemQuery = ` INSERT INTO orderitem (orderid, productid, productqu) VALUES (?, ?, ?)`;

            db.query(sqlItemQuery, [orderid, productid, quantity], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Error inserting order item" });
                }
                 else{
                const deletequery = `DELETE FROM cartproduct  WHERE userid=?`;
                db.query(deletequery, [userId], (err) => {
                    if (err) return res.status(500)({message:"Data issue"})
                        console.error(err);
                        return res.status(200).json({ message: " deleted" });
                    
                });
}
            });
       
       
     });
    }
    });

});


app.get('/purchase', verifytoken, authorizeRoles(["user"]), (req, res) => {
    // console.log("hello")
    let userId = req.user.id;

    let sqlquery = `select  orderid, quantity, date, totalamt, status from orders `;

    console.log("userid",userId)
    db.query(sqlquery, [userId], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ message: "Database error" })
        }
        res.status(200).json(result);
    })
})

app.get('/admin/category', verifytoken, authorizeRoles(["admin"]), (req, res) => {

    let sqlQuery = `SELECT *  FROM category`;

    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database issue" });
        }
        res.status(201).json(result);
    });
});

app.delete('/admin/category/:id', verifytoken, authorizeRoles(["admin"]), (req, res) => {
    let categoryId = req.params.id;
    let sqlQuery = ` DELETE FROM category WHERE categoryid=?`;

    db.query(sqlQuery, [categoryId], (err, result) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ message: 'Database issue' });
        }

        res.status(200).json({ message: 'Category deleted' });
    });
});


app.put('/admin/category/:id', (req, res) => {
    let categoryId = req.params.id;
    let { categryname } = req.body

    let sqlQuery = `update category set categryname=? where categoryid=?`
    db.query(sqlQuery, [categryname, categoryId], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message: "Database issue" })
        }
        else res.status(200).json({ message: "Data Updated" })
    })
})


app.get("/admin/users", verifytoken, authorizeRoles(["admin"]), (req, res) => {
    let sqlQuery = `SELECT id, fname, emailid FROM users`;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database Issue" });
        }
        res.status(200).json(result);
    });
});


app.delete('/admin/users/:id', verifytoken, authorizeRoles(["admin"]), (req, res) => {
    let userId = req.params.id;
    console.log("Deleting userId:", req.params.id);
    let sqlQuery = `DELETE FROM users WHERE id=?`;

    db.query(sqlQuery, [userId], (err, result) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ message: 'Database issue' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    });
});

// id, fname, lname, emailid, password, mobile, cityid, role
app.put('/admin/users/:id', (req, res) => {
    let userId = req.params.id;
    let { fname, emailid } = req.body;

    let sqlQuery = `update users set fname = ?,emailid = ? where id=?`
    db.query(sqlQuery, [fname, emailid, userId], (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message: "Database issue" })
        }
        else res.status(200).json({ message: "Data Updated" })
    })

})

app.get('/adminpurchases', verifytoken, authorizeRoles(["admin"]), (req, res) => {
    let userId = req.user.id;

    let query = `
select o.orderid,u.fname,o.quantity,o.totalamt,o.status from orders as o inner join users as u 
on o.userid=u.id `;


    db.query(query, [userId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(200).json(result);
    });
});

app.put("/status/:orderid", verifytoken, authorizeRoles(["admin"]), (req, res) => {
    const { orderid } = req.params
    const { status } = req.body

    console.log("Params:", req.params)
    console.log("Body:", req.body)



    const query = "UPDATE orders SET status = ? WHERE orderid = ?"
    db.query(query, [status, orderid], (err, result) => {
        if (err) {
            console.error("DB Error:", err)
            return res.status(500).json({ message: "Database error", error: err })
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Order not found" })
        }

        res.status(200).json({ message: "Order status updated successfully" })
    });
});












app.listen(5000, (err) => {
    if (err) console.log(err)
    else console.log(5000)
})
