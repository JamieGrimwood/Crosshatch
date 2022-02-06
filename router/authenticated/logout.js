const express = require('express');
const router = express.Router();

router.get('/logout', async (req, res) => {
    res.session.destroy()
    res.redirect('/')
})

module.exports = router;