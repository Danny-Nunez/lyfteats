import connectDb from "../../../config/connectDb";
import Restaurant from "../../../models/restaurantModel";
import verifyJwt from "../../../middlewares/verifyJWT";
import { del } from "@vercel/blob";

/**
 * @desc   Delete aws key
 * @route  DELETE /api/restaurant/deletePrevKey
 * @method DELETE
 * @access Private
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */

/**
 * @swagger
 * paths:
 *  /api/restaurant/deletePrevKey:
 *    delete:
 *      tags: [Restaurant]
 *      summary: Deletes current aws key for image
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
 *          description: OK
 *        400:
 *          description: Only DELETE method allowed || Missing restaurant id
 *        404:
 *          description: Restaurant does not exist
 *        500:
 *          description: Server Error
 *        501:
 *          description: Could not delete previous image in s3
 */
const handler = async (req, res) => {
  // Validate request method
  if (req.method !== "DELETE") {
    return res.status(400).json({
      message: "Only DELETE method allowed",
    });
  }

  // Validate restaurant id
  const restaurantId = req.id;

  if (!restaurantId) {
    return res.status(400).json({
      message: "Missing restaurant id",
    });
  }

  try {
    // Connect to db
    await connectDb();

    // Get restaurant
    const targetRestaurant = await Restaurant.findById(restaurantId).exec();

    if (!targetRestaurant) {
      return res.status(404).json({
        message: "Restaurant does not exist",
      });
    }

    // Delete previous image in Vercel Blob Storage
    const targetKey = targetRestaurant.awsKey;
    let blobData;
    if (targetKey && targetKey !== "") {
      try {
        // Construct full URL from key or use the stored image URL
        const blobUrl = targetRestaurant.image || `https://${process.env.VERCEL_BLOB_STORE_ID}.public.blob.vercel-storage.com${targetKey}`;
        blobData = await del(blobUrl, {
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
      } catch (error) {
        // If deletion fails, log but don't fail the request
        console.error("Error deleting blob:", error);
      }
    }

    return res.status(200).json({
      message: "OK",
      blobData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export default verifyJwt(handler, "Restaurant");
