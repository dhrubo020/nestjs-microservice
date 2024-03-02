import { randomUUID } from 'crypto';
import { model, Schema } from 'mongoose';

const PostSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const AggSchema = new Schema(
  {
    userId: {
      type: String,
      trim: true,
      required: true,
    },

    content: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const PostModel = model('posts', PostSchema);
const AggModel = model('agg', AggSchema);
export { PostModel, AggModel };
