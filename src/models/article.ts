import { Model, Schema, Document, model } from "mongoose";
import { Article } from "../types/article";

interface ArticleAttrs extends Article { }

interface ArticleDoc extends Document, Article {
    createdAt: Date;
    updatedAt: Date;
}

interface ArticleModel extends Model<ArticleDoc> {
    build(attrs: ArticleAttrs): ArticleDoc;
}


const ArticleSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    publication_name: {
        type: String,
        required: true
    },
    publication_language: {
        type: String,
        required: true
    },
    publication_date: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    keywords: {
        type: [String],
        required: true
    },

},
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret: any) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);


ArticleSchema.statics.build = function (attrs: ArticleAttrs) {
    return new this(attrs);
};

const Article = model<ArticleDoc, ArticleModel>("Article", ArticleSchema);

export { Article };