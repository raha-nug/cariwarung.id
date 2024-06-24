const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// get all products
const getAllProducts = async (req, res) => {
  const data = await prisma.product.findMany();
  res.status(200).send(data);
};

// get one product
const getOneProduct = async (req, res) => {
  const id = Number(req.params.id);
  const data = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  res.status(200).send(data);
};

// create product
const createProduct = async (req, res) => {
  const { warungId } = req.body;

  try {
    const result = await prisma.product.create({
      data: {
        ...req.body,
        warungId: Number(warungId),
      },
    });

    res.status(201).send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  } finally {
    async () => {
      await prisma.$disconnect();
    };
  }
};

// edit product
const editProduct = async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body;

  try {
    const result = await prisma.product.update({
      where: {
        id,
      },
      data,
    });

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

// delete product
const deleteProduct = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.product.delete({
      where: {
        id,
      },
    });

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
  getAllProducts,
  getOneProduct,
  createProduct,
  editProduct,
  deleteProduct,
};
