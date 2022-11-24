const send = (res, message, data) => {
  return res.status(200).json({ success: true, statusCode: 200, message, data: data || {} });
};
const sendFile = (res, filePath, fileName) => {
  return res.sendFile(filePath, fileName);
};
const sendError = (res, status, message, error) => {
  let now = new Date();
  const sendObj = { success: false, message, statusCode: status, error: error || {}, date: new Date(now.getTime() + 330 * 60 * 1000) };
  // ErrorLog.create(sendObj);
  return res.status(status).json(sendObj);
};
const redirect = (res, message, error) => {
  let now = new Date();
  const sendObj = { success: false, message, error: error || {}, date: new Date(now.getTime() + 330 * 60 * 1000) };
  // ErrorLog.create(sendObj);
  return res.redirect("/");
};
export { send, sendError };
