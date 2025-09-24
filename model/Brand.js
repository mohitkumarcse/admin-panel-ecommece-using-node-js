const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    isHomeTrending: {
      type: Boolean,
      default: false,
    },
    isMenTrending: {
      type: Boolean,
      default: false,
    },
    isWomenTrending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Brand', BrandSchema);
