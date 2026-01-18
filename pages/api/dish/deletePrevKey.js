import connectDb from "../../../config/connectDb";
import Dish from "../../../models/dishModel";
import verifyJwt from "../../../middlewares/verifyJWT";
import { del } from "@vercel/blob";

/**
 * @desc   Delete aws key
 * @route  DELETE /api/dish/deletePrevKey
 * @method DELETE
 * @access Private
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */

/**
 * @swagger
 * paths:
 *  /api/dish/deletePrevKey:
 *    delete:
 *      tags: [Dish]
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
 *          description: Only DELETE method allowed || Missing restaurant id || Missing dish id
 *        404:
 *          description: Dish does not exist
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

  // Validate dishId
  const { dishId } = req.body;

  if (!dishId) {
    return res.status(400).json({
      message: "Missing dish id",
    });
  }

  try {
    // Connect to db
    await connectDb();

    // Get target dish
    const targetDish = await Dish.findById(dishId).exec();

    if (!targetDish) {
      return res.status(404).json({
        message: "Dish does not exist",
      });
    }

    // Delete previous image in Vercel Blob Storage
    const targetKey = targetDish.awsKey;

    let blobData;
    if (targetKey && targetKey !== "") {
      try {
        // Construct full URL from key or use the stored image URL
        const blobUrl = targetDish.image || `https://${process.env.VERCEL_BLOB_STORE_ID}.public.blob.vercel-storage.com${targetKey}`;
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
      error,
    });
  }
};

export default verifyJwt(handler, "Restaurant");
