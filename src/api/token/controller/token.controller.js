const httpStatus = require('http-status');
const { isValidRefreshToken } = require('../service/token.service');

const generateAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(httpStatus.BAD_REQUEST).send('Refresh token is required');
        }

        const accessToken = await isValidRefreshToken(refreshToken);
        if (!accessToken) {
            return res.status(httpStatus.UNAUTHORIZED).send('Invalid refresh token');
        }

        res.status(httpStatus.OK).json({ accessToken });
    } catch (error) {
        console.error('Error in generateAccessTokenController:', error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Internal server error');
    }
};

module.exports = { generateAccessToken };


