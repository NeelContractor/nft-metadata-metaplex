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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const umi_1 = require("@metaplex-foundation/umi");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const umi_uploader_irys_1 = require("@metaplex-foundation/umi-uploader-irys");
const helpers_1 = require("@solana-developers/helpers");
const web3_js_1 = require("@solana/web3.js");
const fs_1 = require("fs");
const path = __importStar(require("path"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"));
    const user = yield (0, helpers_1.getKeypairFromFile)('~/.config/solana/id.json');
    yield (0, helpers_1.airdropIfRequired)(connection, user.publicKey, 1 * web3_js_1.LAMPORTS_PER_SOL, 0.1 * web3_js_1.LAMPORTS_PER_SOL);
    console.log(`Loaded user:`, user.publicKey.toBase58());
    const umi = (0, umi_bundle_defaults_1.createUmi)(connection);
    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
    umi
        .use((0, umi_1.keypairIdentity)(umiKeypair))
        .use((0, mpl_token_metadata_1.mplTokenMetadata)())
        .use((0, umi_uploader_irys_1.irysUploader)());
    const collectionImagePath = path.resolve(__dirname, "collection.png");
    const buffer = yield fs_1.promises.readFile(collectionImagePath);
    let file = (0, umi_1.createGenericFile)(buffer, collectionImagePath, {
        contentType: 'image/png',
    });
    // const [image] = await umi.uploader.upload([file]);
    const image = "https://pnvxakdrrvn6wlxp5p3b36zpw5r3e7gcjlqybmpo7xpzf7jf5sva.arweave.net/e2twKHGNW-su7-v2Hfsvt2OyfMJK4YCx7v3fkv0l7Ko";
    console.log("image uri:", image);
    const uri = yield umi.uploader.uploadJson({
        name: "My Collection 2",
        symbol: "MC2",
        description: "My collection description 2",
        image,
    });
    console.log("Collection offchain metadata URI:", uri);
    const collectionMint = (0, umi_1.generateSigner)(umi);
    yield (0, mpl_token_metadata_1.createNft)(umi, {
        mint: collectionMint,
        name: "My Collection 2",
        uri,
        updateAuthority: umi.identity.publicKey,
        sellerFeeBasisPoints: (0, umi_1.percentAmount)(0),
        isCollection: true,
    }).sendAndConfirm(umi, { send: { commitment: "finalized" } });
    let explorerLink = (0, helpers_1.getExplorerLink)("address", collectionMint.publicKey, "devnet");
    console.log(`Collection NFT: ${explorerLink}`);
    console.log(`Collection NFT address is: ${collectionMint.publicKey}`);
    console.log(`✅Finished successfully!!!`);
}))();
