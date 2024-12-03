"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranscodeRepository = void 0;
const Transcoder_1 = require("../Entities/Transcoder");
const Transcoder_2 = __importDefault(require("../Model/Transcoder"));
class TranscodeRepository {
    addFileDetails(fileName, instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield Transcoder_2.default.create({ fileName, status: Transcoder_1.Status.transcoding, instructorId, });
                return response;
            }
            catch (e) {
                //   throw new DBConnectionError()
            }
        });
    }
    updateStatus(id, status, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const videoData = yield Transcoder_2.default.findByIdAndUpdate(id, Object.assign({ status }, data), { new: true });
                return videoData;
            }
            catch (e) {
                throw new e();
            }
        });
    }
    getData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield Transcoder_2.default.find({ instructorId: id });
                return response;
            }
            catch (e) {
                // throw new DBConnectionError()
            }
        });
    }
}
exports.TranscodeRepository = TranscodeRepository;
