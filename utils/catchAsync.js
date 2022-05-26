const catchAsync = (codeClean) => {
  return (req, res, next) => {
    codeClean(req, res, next).catch(next);
  };
};

module.exports = { catchAsync };
