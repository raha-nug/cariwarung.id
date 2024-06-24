const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// get all types
const getAllTypes = async (req, res) => {
  const data = await prisma.type.findMany();
  res.status(200).send(data);
};

// get one type
const getOneType = async (req, res) => {
  const id = Number(req.params.id);
  const data = await prisma.type.findUnique({
    where: {
      id,
    },
  });

  res.status(200).send(data);
};

// create type
const createType = async (req, res) => {
  const { warungId } = req.body;

  try {
    const result = await prisma.type.create({
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

// edit type
const editType = async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body;

  try {
    const result = await prisma.type.update({
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

// delete type
const deleteType = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.type.delete({
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

module.exports = {
  getAllTypes,
  getOneType,
  createType,
  editType,
  deleteType,
};
