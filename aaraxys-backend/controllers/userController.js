import User from '../models/User.js';

// @desc    Update user margin (Deposit/Withdraw)
// @route   POST /api/user/funds
// @access  Private
export const updateFunds = async (req, res) => {
  try {
    const { amount, action } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await User.findById(req.user._id);

    if (action === 'DEPOSIT') {
      user.availableMargin += Number(amount);
    } else if (action === 'WITHDRAW') {
      if (user.availableMargin < amount) {
        return res.status(400).json({ message: 'Insufficient funds for withdrawal' });
      }
      user.availableMargin -= Number(amount);
    } else {
       return res.status(400).json({ message: 'Invalid action type' });
    }

    await user.save();

    res.json({
      message: 'Funds updated successfully',
      availableMargin: user.availableMargin
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
