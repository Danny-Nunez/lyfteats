import connectDb from "../../../config/connectDb";
import User from "../../../models/userModel";
import jwt from "jsonwebtoken";

/**
 * @desc   User refresh token endpoint
 * @route  GET /api/user/refreshToken
 * @method GET
 * @access Public
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */

/**
 * @swagger
 * paths:
 *  /api/user/refreshToken:
 *    get:
 *      tags: [User]
 *      summary: Handle User Refresh Token
 *      components:
 *        securitySchemes:
 *          cookieAuth:
 *            type: token
 *            in: cookie
 *            name: token
 *      security:
 *        - cookieAuth: []
 *      responses:
 *        200:
 *          description: OK - Access Token
 *        400:
 *          description: Only GET method allowed
 *        401:
 *          description: Not Authorized
 *        403:
 *          description: Unable to authenticate
 *        500:
 *          description: Server Error
 */
export default async function handler(req, res) {
  // Validate request method
  if (req.method !== "GET") {
    return res.status(400).json({
      message: "Only GET method allowed",
    });
  }

  // Verify cookies
  const cookies = req.cookies;

  if (!cookies?.token) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  try {
    // Connect to db
    await connectDb();

    // Get token from cookies
    const refreshToken = cookies.token;

    // Get target user
    const targetUser = await User.findOne({ refreshToken }).exec();

    if (!targetUser) {
      console.error("User not found with refresh token");
      return res.status(403).json({
        message: "Unable to authenticate - user not found",
      });
    }

    // Validate token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          console.error("JWT verification error:", err.message);
          return res.status(403).json({
            message: "Unable to authenticate - invalid token",
          });
        }

        // Ensure IDs are strings for comparison
        const userId = targetUser._id ? targetUser._id.toString() : targetUser.id;
        const decodedId = decoded.id ? decoded.id.toString() : decoded.id;

        if (userId !== decodedId) {
          console.error("ID mismatch - user:", userId, "decoded:", decodedId);
          return res.status(403).json({
            message: "Unable to authenticate - ID mismatch",
          });
        }

        // Create new access token
        const accessToken = jwt.sign(
          { id: decodedId },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        return res.status(200).json({ accessToken });
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
}
