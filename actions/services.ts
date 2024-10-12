// import { getSession } from "@auth/express";

// export const authenticatedUser = async (req, res, next) => {
//   const session = req.locals.session ?? (await getSession(req, authConfig));

//   if (!session?.user) {
//     res.redirect("/log-in");
//   } else {
//     next();
//   }
// };
