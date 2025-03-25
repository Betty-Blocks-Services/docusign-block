export default {
	transform: {
		"^.+\\.jsx?$": "esbuild-jest",
	},
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	testEnvironment: "node",
};
