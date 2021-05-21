exports.errorManager = (res, err) => {
  res.send({ status: "error", description: err });
};
