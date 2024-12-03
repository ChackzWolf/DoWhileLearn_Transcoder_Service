"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const Transcoder_1 = require("../Entities/Transcoder");
const transcoderSchema = new mongoose_1.default.Schema({
    fileName: {
        type: String,
    },
    generatedName: {
        type: String,
    },
    status: {
        type: String,
        enum: [Transcoder_1.Status.transcoding, Transcoder_1.Status.completed, Transcoder_1.Status.subtitle, Transcoder_1.Status.completed, Transcoder_1.Status.error, Transcoder_1.Status.finishing],
        default: Transcoder_1.Status.transcoding
    },
    videoUrl: {
        type: String
    },
    subtitleUrl: {
        type: String,
    },
    instructorId: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});
const TranscoderModel = mongoose_1.default.model("Transcoder", transcoderSchema);
exports.default = TranscoderModel;
