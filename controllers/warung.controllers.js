const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { Storage } = require("@google-cloud/storage");

// cloud storage connect
const storage = new Storage({
  keyFilename: "credentials.json",
});

const bucketName = process.env.BUCKET_NAME;
const bucket = storage.bucket(bucketName);

// Custom Error class (create separate file)
class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

// get all warung
const getAllWarungs = async (req, res) => {
  const data = await prisma.warung.findMany({
    include: {
      _count: true,
      products: true,
      type: true,
    },
  });

  const result = await Promise.all(
    data.map(async (warung) => {
      const getFile = bucket.file(warung.coverImage);
      const [url] = await getFile.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60, // Expires in 1 hour
      });
      return { ...warung, coverImage: url }; // Create a new object with updated URL
    })
  );

  if (data.length == 0) {
    res.status(200).send({ message: "Data doesn't exist" });
    return;
  } else {
    res.status(200).send(result);
  }
};

// get one warung
const getOneWarung = async (req, res) => {
  const id = Number(req.params.id);
  const data = await prisma.warung.findUnique({
    where: {
      id,
    },
    include: {
      _count: true,
      products: true,
      type: true,
    },
  });

  if (!data) {
    res.status(200).send({ message: "Data doesn't exist" });
  } else {
    const getFile = bucket.file(data.coverImage);
    const [url] = await getFile.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60,
    });

    const result = { ...data, coverImage: url };

    res.status(200).send(result);
  }
};

const createWarung = async (req, res) => {
  const file = req.file;
  const data = req.body;

  try {
    // Validate presence of cover image
    if (!file) {
      throw new CustomError(
        400,
        "Please provide a cover image for your warung."
      );
    }

    // Generate unique filename
    const fileName = Date.now() + "-" + file.originalname.replace(/\s/g, "");

    // Create a writable stream for the file upload
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      contentType: file.mimetype,
    });

    // Handle upload errors
    blobStream.on("error", (error) => {
      throw new CustomError(500, `Error uploading file: ${error.message}`);
    });

    // Log successful upload on finish
    blobStream.on("finish", () => {
      console.log(`File: ${fileName} uploaded successfully`);
    });

    // Upload the file content
    blobStream.end(file.buffer);

    // Create warung data with cover image URL
    const result = await prisma.warung.create({
      data: {
        ...data,
        coverImage: fileName,
      },
    });

    // Send successful response
    res.status(201).send(result);
  } catch (error) {
    // Handle custom errors or unexpected errors
    if (error instanceof CustomError) {
      res.status(error.statusCode).send({ message: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).send({ message: "Internal server error" }); // Generic error message for unexpected issues
    }
  } finally {
    // Disconnect from Prisma client (assuming it's a connection pool)
    await prisma.$disconnect();
  }
};

// edit warung
const editWarung = async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body;
  const file = req.file;

  try {
    const dataForUpdate = await prisma.warung.findUnique({
      where: {
        id,
      },
    });

    // Generate unique filename
    const fileName = Date.now() + "-" + file.originalname.replace(/\s/g, "");

    console.log(fileName);

    // Create a writable stream for the file upload
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      contentType: file.mimetype,
    });

    // Handle upload errors
    blobStream.on("error", (error) => {
      throw new CustomError(500, `Error uploading file: ${error.message}`);
    });

    // Log successful upload on finish
    blobStream.on("finish", () => {
      console.log(`File: ${fileName} uploaded successfully`);
    });

    // Upload the file content
    blobStream.end(file.buffer);

    const result = await prisma.warung.update({
      where: {
        id,
      },
      data: {
        ...data,
        coverImage: fileName,
      },
    });


    // delete existing file

    const existingFile = bucket.file(dataForUpdate.coverImage);
    const [exists] = await existingFile.exists();

    if (!exists) {
      res.status(400).send({ message: "File not found" });
      return;
    }

    await bucket.file(dataForUpdate.coverImage).delete();
    console.log(`Delete: ${dataForUpdate.coverImage} deleted successfully`);

    res.status(200).send({
      message: "Update Success",
      data: result,
    });
  } catch (error) {
    res.send({ message: error.message });
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
};

// delete warung
const deleteWarung = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const data = await prisma.warung.delete({
      where: {
        id,
      },
    });

    const file = bucket.file(data.coverImage);
    const [exists] = await file.exists();

    if (!exists) {
      res.status(400).send({ message: "File not found" });
      return;
    }

    await bucket.file(data.coverImage).delete();
    console.log(`Delete: ${data.coverImage} deleted successfully`);

    res.status(200).send({ message: "Delete Success" });
  } catch (error) {
    res.send({ message: error.message });
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
};

// export module
module.exports = {
  getAllWarungs,
  getOneWarung,
  createWarung,
  editWarung,
  deleteWarung,
};
