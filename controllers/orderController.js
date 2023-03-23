const Items = require('../models/itemModels');
const Users = require('../models/userModels');
const Orders = require('../models/orderModels');
const asyncHandler = require('express-async-handler')

const getInfoAboutChatbot = asyncHandler (async (req, res, next) => {
  try {
    req.session.authenticated = true;
    req.session.username = req.body.username;

    res.status(200).json({
      status: 'success',
      message: `Hi ${req.body.username}!👋, Welcome to chatbot`,        
       data: {
        instructions: [
          {
            option: 'a',
            instruction: 'Select 1 to Place an order',
          },
          {
            option: 'b',
            instruction: 'Select 99 to checkout order',
          },
          {
            option: 'c',
            instruction: 'Select 98 to see order history',
          },
          {
            option: 'd',
            instruction: 'Select 97 to see current order',
          },
          {
            option: 'e',
            instruction: 'Select 0 to cancel order',
          },
        ],
      },
    });
  } catch (error) {
    next(new Error(`Try accessing this page at a later time ${error}`));
  }
});




const placeOrder = asyncHandler(async (req, res, next) => {
  try {
    if (req.session.init) {
      res.status(412).json({
        status: 'Pre condition Failed',
        message: `Please select 99 to checkout your pending order.`,
      });
      return;
    }

    // 1.) count documents and create ID for order placed
    const count = await Orders.countDocuments();
    let orderId = count + 1;

    req.session.init = true;

    req.session.orderId = orderId;

    await Orders.create({
      id: orderId,
      merchant: req.session.username,
    });
    //res.json(Items)
    res.status(200).json({
      status: 'success',
      message:
        'Started an Order, please select items using their respective numbers.',
       data: {
         Items,
       }
    });
  } catch (error) {
    console.log(error);
  }
});

const checkoutOrder = asyncHandler(async (req, res, next) => {
  try {
    // 1.) check if an order is opened.
    if (!req.session.init) {
      res.status(206).json({
        status: 'partial content',
        message: `You have no open order, Select 1 to place an order.`,
      });
    }

    // 2.) Find the total order and amount
    const order = await Orders.findOne({ id: req.session.orderId });

    // 3.) check If any item is selected, and retun message
    if (!order.items.length)
      res.status(206).json({
        status: 'success',
        message: 'No order placed, Please select an item.',
      });

    // 4.) if items exists, destroy the initialized order and render the order pleced for payment
    let fulfilledOrder;
    if (order.items.length) {
      fulfilledOrder = await Orders.findOneAndUpdate(
        { id: req.session.orderId },
        { fulfilled: true },
        {
          new: true,
        }
      );
      req.session.init = false;
    }
    // if (order.items.length) req.session.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Order Placed👍.',
      data: {
        order: fulfilledOrder,
      },
    });
  } catch (error) {}
});

const orderHistory =  asyncHandler(async (req, res, next) => {
  try {
    let orders;

    // 1.) check if user has placed any order recently
    if (req.session.init) {
      res.status(206).json({
        status: 'success',
        message: `Please select 99 to checkout or 0 to cancel pending order.`,
      });
      return;
    }

    orders = await Orders.find({ merchant: req.session.username }).where({
      fulfilled: true,
    });

    if (!orders.length) {
      res.status(206).json({
        status: 'success',
        message: `You have No orders, Please select 1 to place an order.`,
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Order History sent',
      count: orders.length,
      data: {
        orders,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

const currentOrder = asyncHandler(async (req, res, next) => {
  try {
    let currentOrder;

    if (!req.session.init) {
      res.status(412).json({
        status: 'Pre condition Failed',
        message: `You have no order currently, Please select 1 to place an order.`,
      });
      return;
    }

    if (req.session.init)
      currentOrder = await Orders.findOne({ id: req.session.orderId });

    res.status(200).json({
      status: 'success',
      message: 'Current Order⌛:',
      data: {
        currentOrder,
      },
    });
  } catch (error) {}
});

const cancelOrder = asyncHandler(async (req, res, next) => {
  try {
    let order;

    if (!req.session.init) {
      res.status(412).json({
        status: 'Pre condition Failed',
        message: `You have no open order, Please select 1 to place an order.`,
      });
      return;
    }

    if (req.session.init) {
      order = await Orders.findOne({ id: req.session.orderId });

      await Orders.findOneAndUpdate(
        { id: req.session.orderId },
        { cancelled: true }
      );
      req.session.init = false;

      res.status(200).json({
        status: 'success',
        message: 'Order cancelled😓.',
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const selectItem =asyncHandler(async (req, res, next) => {
  try {
    // 1.) extract selected id (item) from request params
   // const itemId =  req.params.id
    // if(itemId){
    //   res.json(itemId);
    
  
    //  }else{
  
    //   res.status(404)
    //   throw new Error({message: 'Item not found'})
    //  }
   // const itemId = await Items.find(req.id).populate(
   // 'id',
  //  'items'
  //)
    const itemId = Items.find(function (product) {product.id === req.params.id})
    //const itemId  =  req.params.id
       //const {id } = itemId
    // if(itemId){
    //  res.json(itemId)
    //   product = JSON.stringify(itemId);
    //   res.json(product)
     // console.log(itemId?.amount);
        //  res.status(200).json({
        //   status: 'success',
        //   message: 'item selected',
        //   data: {
        //     console.log(itemId)
          //},
        //});
    
      //  }else{
    
      //   res.status(404)
      //   throw new Error({message: 'Item not found'})
      // }

    


    // 2.) Extract id from users session
    const orderId = req.session.orderId;

    // 3.) Find user opened or placed order using the extracted id, since it is similar to the order id
    let order = await Orders.findOne({ id: orderId });

    // 2.) check if order has been placed or opened and return feedback
    console.log(req.session.id);
    if (!req.session.init) {
      res.status(206).json({
        status: 'partial content',
        message: `You have no open order, Select 1 to place an order.`,
      });
      return;
    }

    // 3.) Read through your list items and compare chosen item with available items
    Items.forEach(async (entry) => {
      if (itemId == entry.id) {
        // 4.) if orderId exists find the order in the database
        // const order = await Orders.findById(orderId);

        if (order) {
          let totalItemsAmount = 0;
          order.items.push({ item: entry.item, amount: entry.amount });
          order.items.forEach(
            (element) => (totalItemsAmount += element.amount)
          );
          order.amount = totalItemsAmount;
          order.itemsCount = order.items.length;

          await Orders.findByIdAndUpdate(order._id, order);

          res.status(200).json({
            status: 'success',
            message: `Selected ${entry.item} @ $${entry.amount}`,
            data: {
              order,
            },
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = {getInfoAboutChatbot, placeOrder, checkoutOrder, orderHistory, currentOrder, cancelOrder, selectItem, };