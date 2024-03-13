"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const node_opcua_1 = require("node-opcua");
const TMC_VERSION = 1;
Error.stackTraceLimit = Infinity;
const initializeOpcXml = (addressSpace) => {
    const ns = addressSpace.getNamespaceIndex("http://opcfoundation.org/UA/XML/");
    const namespace = addressSpace.getOwnNamespace();
    const idoanwd = namespace.addObject({
        browseName: "aaaaa",
        organizedBy: addressSpace.rootFolder.objects,
    });
    const idoabbnwd = namespace.addObject({
        browseName: "bbbb",
        organizedBy: addressSpace.rootFolder.objects,
    });
};
const main = async () => {
    const tmcPath = TMC_VERSION === 1
        ? path.join(__dirname, "models/legacy/Opc.Ua.TMC.NodeSet2 1.0.0.xml")
        : path.join(__dirname, "models/Tobacco_Machinery_72948743.xml");
    const server_options = {
        port: 9595,
        nodeset_filename: [
            node_opcua_1.nodesets.standard,
            path.join(__dirname, "models/PackML - Packaging Control_4140376033.xml"),
            path.join(__dirname, "models/Unified Architecture - Device Model_1060041392.xml"),
            tmcPath,
        ],
    };
    process.title = "Node OPCUA Server on port : " + server_options.port;
    const server = new node_opcua_1.OPCUAServer(server_options);
    server.on("post_initialize", () => {
        const addressSpace = server.engine.addressSpace;
        initializeOpcXml(addressSpace);
    });
    try {
        await server.start();
    }
    catch (e) {
        console.error(e);
    }
    const endpointUrl = server.getEndpointUrl();
    console.log(chalk_1.default.bgGreenBright("  szlugi wstaly  "));
    console.log(chalk_1.default.yellow("  server on port      :"), chalk_1.default.cyan(server.endpoints[0].port.toString()));
    console.log(chalk_1.default.yellow("  endpointUrl         :"), chalk_1.default.cyan(endpointUrl));
    console.log(chalk_1.default.yellow("\n  server now waiting for connections. CTRL+C to stop"));
    process.on("SIGINT", async () => {
        // only work on linux apparently
        await server.shutdown(1000);
        console.log(chalk_1.default.red.bold(" shutting down completed "));
        process.exit(-1);
    });
};
main();
