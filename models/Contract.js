const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema(
  {
    contract_reference: {
      type: String,
      required: [true, 'Please add a contract'],
      trim: true,
    },
    responsable: {
      type: String,
      required: [true, 'Please add a responsible of the contract'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please add a contract type'],
      trim: true,
    },
    statut: {
      type: String,
      required: true,
      enum: ['In progress', 'Expired_soon', 'Expired', 'Closed'],
    },
    fournisseur: {
      type: mongoose.Schema.ObjectId,
      ref: 'Fournisseur',
    },
    truck: {
      type: mongoose.Schema.ObjectId,
      ref: 'Truck',
    },
    contract_start_date: {
      type: Date,
      default: Date.now,
    },
    contract_expiry_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Contract', ContractSchema);
