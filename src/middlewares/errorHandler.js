export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const errorMessage = err.message || "Something went wrong";

  console.error(err.stack);

  res.status(status).json({
    message: "Something went wrong",
    error: errorMessage,
  });
};
