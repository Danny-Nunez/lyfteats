import connectDb from "../../../config/connectDb";
import Restaurant from "../../../models/restaurantModel";
import cookie from "cookie";

/**
 * @desc   Restaurant sign out endpoint
 * @route  POST /api/restaurant/signOut
 * @method POST
 * @access Public
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */

/**
 * @swagger
 * paths:
 *  /api/restaurant/signOut:
 *    post:
 *      tags: [Restaurant]
 *      summary: Sign Out Restaurant
 *      components:
 *        securitySchemes:
 *          cookieAuth:
 *            type: token
 *            in: cookie
 *            name: token
 *      security:
 *        - cookieAuth: []
 *      responses:
 *        204:
 *          description: OK, no content
 *        400:
 *          description: Only POST method allowed
 *        500:
 *          description: Server Error
 */
export default async function handler(req, res) {
  // Validate request method
  if (req.method !== "POST") {
    return res.status(400).json({
      message: "Only POST method allowed",
    });
  }

  // Verify cookies
  const cookies = req.cookies;

  if (!cookies?.token) {
    return res.status(204).end();
  }

  try {
    // Connect to db
    await connectDb();

    // Get target User
    const targetRestaurant = await Restaurant.findOne({
      refreshToken: cookies.token,
    }).exec();

    if (!targetRestaurant) {
      const isProduction = process.env.NODE_ENV === "production";
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", "", {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "strict" : "lax",
          maxAge: 0, // Expire immediately
          path: "/",
        })
      );
      return res.status(204).end();
    }

    // Remove user's refresh token in db
    targetRestaurant.refreshToken = "";
    await targetRestaurant.save();

    // Remove cookie in client
    const isProduction = process.env.NODE_ENV === "production";
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 0, // Expire immediately
        path: "/",
      })
    );

    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
}
