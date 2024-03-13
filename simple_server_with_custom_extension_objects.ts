import * as path from "path";
import chalk from "chalk";
import opcua, { nodesets, OPCUAServer } from "node-opcua";

const TMC_VERSION: 1 | 2 = 1;

Error.stackTraceLimit = Infinity;

const initializeOpcXml = (addressSpace: opcua.AddressSpace) => {
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
  const tmcPath =
    TMC_VERSION === 1
      ? path.join(__dirname, "models/legacy/Opc.Ua.TMC.NodeSet2 1.0.0.xml")
      : path.join(__dirname, "models/Tobacco_Machinery_72948743.xml");

  const server_options: opcua.OPCUAServerOptions = {
    port: 9595,
    nodeset_filename: [
      nodesets.standard,
      path.join(__dirname, "models/PackML - Packaging Control_4140376033.xml"),
      path.join(
        __dirname,
        "models/Unified Architecture - Device Model_1060041392.xml"
      ),
      tmcPath,
    ],
  };

  process.title = "Node OPCUA Server on port : " + server_options.port;

  const server = new OPCUAServer(server_options);

  server.on("post_initialize", () => {
    const addressSpace = server.engine.addressSpace!;
    initializeOpcXml(addressSpace);
  });

  try {
    await server.start();
  } catch (e) {
    console.error(e);
  }

  const endpointUrl = server.getEndpointUrl()!;

  console.log(chalk.bgGreenBright("  szlugi wstaly  "));
  console.log(
    chalk.yellow("  server on port      :"),
    chalk.cyan(server.endpoints[0].port.toString())
  );
  console.log(chalk.yellow("  endpointUrl         :"), chalk.cyan(endpointUrl));
  console.log(
    chalk.yellow("\n  server now waiting for connections. CTRL+C to stop")
  );

  process.on("SIGINT", async () => {
    // only work on linux apparently
    await server.shutdown(1000);
    console.log(chalk.red.bold(" shutting down completed "));
    process.exit(-1);
  });
};
main();
