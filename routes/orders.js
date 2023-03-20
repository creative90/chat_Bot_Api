const {getInfoAboutChatbot, placeOrder, checkoutOrder, orderHistory, currentOrder, cancelOrder, selectItem, } = require('../controllers/orderController');
const router = require("express").Router();


// Reforming the router and the router handlers, where should we put the handlers
// should we access the client replies via the request params or body?


 

router.route('/').get(getInfoAboutChatbot);
router.route('/1').get(placeOrder);
router.route('/99').get(checkoutOrder);
router.route('/98').get(orderHistory);
router.route('/97').get(currentOrder);
router.route('/0').get(cancelOrder);

router.route('1/:id').get(selectItem);

module.exports = router;
