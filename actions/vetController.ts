import bcrypt from "bcrypt";
import { addGeneralRefreshToken, createUser, getUser } from "./queries";
import { NextResponse, NextRequest } from "next/server.js";
import nodemailer from "nodemailer";
import { redirect } from "next/navigation";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: import.meta.env.EMAIL,
    pass: import.meta.env.PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

export async function sendMessage(
  name: string,
  email: string,
  tel: string,
  service: string,
  message: string
) {
  try {
    const mailData = {
      from: import.meta.env.EMAIl,
      to: "sugo4354@gmail.com",
      subject: "Contacto Next",
      text: `Hola ${name}${email}${tel}${service}${message} `,
    };

    await transporter.sendMail(mailData);
    NextResponse.redirect("/conctacto");
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createUserForm(formData: FormData) {
  const rawData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    accounts: {
      provider: "credentials",
      providerAccountId: "1234",
    },
  };

  const hashPassword = await bcrypt.hash(rawData.password, 10);
  rawData.password = hashPassword;

  try {
    await createUser(rawData, rawData.accounts);
  } catch (error: any) {
    throw new Error(error);
  }

  return redirect("/");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid Credential";
        default:
          return "Something went wrong";
      }
    }
    throw error;
  }
}

// export const vetController = {
//   sendMessagePost: [

//       const mailData = {
//         from: process.env.EMAL,
//         to: "sugo4354@gmail.com",
//         subject: "Contacto Web",
//         text: `Hola ${name}, ${email} ${tel} ${service} ${message}`,
//       };

//       transporter.sendMail(mailData, (err, _info) => {
//         if (err) {
//           return res.status(404).json(err);
//         }
//         return res.status(200).json({
//           messageSucces: "El mensaje ha sido enviado correctamente",
//           correct: true,
//         });
//       });

//       return res.status(200).json({
//         messageSucces: "El mensaje ha sido enviado correctamente",
//         correct: true,
//       });
//     }),
//   ],

//   signupPost: [
//     validateSignup,
//     asyncHandler(async (req, res) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array(), correct: false });
//       }
//       const { email, firstName, lastName, password } = req.body;

//       const pwHash = await bcrypt.hash(password, 10);

//       const username = { username: firstName + " " + lastName };

//       const accessToken = generateAccessToken(username);
//       const refreshToken = jwt.sign(username, process.env.REFRESH_SECRET);
//       await addGeneralRefreshToken(refreshToken);

//       const userData = {
//         firstName,
//         lastName,
//         email,
//         password: pwHash,
//       };

//       const accountData = {
//         provider: "credentials",
//         providerAccountId: userData.email,
//         access_token: accessToken,
//         refresh_token: refreshToken,
//         expires_at: Math.floor(Date.now() / 1000) + 3600,
//       };

//       try {
//         createUser(userData, accountData);
//         res.status(200).json({ message: "Cuenta creada" });
//       } catch (error) {
//         res.status(404).json({ message: error.message });
//       }
//     }),
//   ],

//   loginPost: asyncHandler(async (req, res) => {
//     try {
//       const { refreshToken, accessToken } = await getUserfromDB(req, res);
//       return res.status(200).json({ accessToken, refreshToken });
//     } catch (err) {
//       res.status(404).json({ message: err.message });
//     }
//   }),

//   updateGet: asyncHandler(async (req, res) => {
//     res.status(200).json({ message: "funcionando" });
//   }),
// };

// export const authenticatedVet = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (token == null) {
//     return res.sendStatus(401);
//   }

//   jwt.verify(token, process.env.SECRET, (err: Error, user) => {
//     if (err) {
//       return res.sendStatus(403);
//     }
//     req.user = user;
//     next();
//   });
// };

// const generateAccessToken = (user) => {
//   return jwt.sign(user, process.env.SECRET, { expiresIn: "15s" });
// };

// const getUserfromDB = async (req, _res) => {
//   const { email, password } = req.body;
//   const user = await getUser(email);

//   if (user) {
//     const validPass = await bcrypt.compare(password, user.password);
//     if (!validPass) {
//       throw new Error("Invalid password");
//     }
//     const username = { username: user.firstName + " " + user.lastName };
//     const accessToken = generateAccessToken(username);
//     const refreshToken = jwt.sign(username, process.env.REFRESH_SECRET);
//     await addGeneralRefreshToken(refreshToken);
//     return { accessToken, refreshToken };
//   }
// };
