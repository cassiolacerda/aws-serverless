module.exports = {
  parseResponseMessage: (data) => {
    if (!data.Payload) {
      return null;
    }
    const payload = JSON.parse(data.Payload);
    if (!payload.body) {
      return null;
    }
    const body = JSON.parse(payload.body);
    if (!body.message) {
      return null;
    }
    return body.message;
  },
};
