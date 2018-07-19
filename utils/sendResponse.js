const sendResponse = (res, status, data, message) => {
    res.status(status).json({
        status,    
        data,
        message,
    });
}; 

module.exports = sendResponse;