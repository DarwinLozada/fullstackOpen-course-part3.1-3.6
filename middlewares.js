const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(err);
};

const unknownEndPoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

module.exports = { errorHandler, unknownEndPoint };
