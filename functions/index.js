const functions = require('firebase-functions');
const swaggerJSDoc = require('swagger-jsdoc');

/**
 * @swagger
 * /getHealthcare:
 *   get:
 *     description: 身長と体重を渡すとBMI,適正体重、肥満度を返してくれる
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: weight
 *         description: 体重(Kg)
 *         in: query
 *         required: true
 *         type: integer
 *       - name: height
 *         description: 身長(Cm)
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: 成功時
 *         schema:
 *           type: object
 *           properties:
 *             bmi:
 *               type: integer
 *               format: int64
 *               description: BMI
 *               example: 22
 *             suitable_weight:
 *               type: integer
 *               format: int64
 *               description: 適正体重
 *               example: 65
 *             degree_of_obesity:
 *               type: string
 *               description: 肥満度
 *               example: 普通
 *       400:
 *         description: パラメータ不足
 *         schema:
 *           type: object
 *           properties:
 *             error_message:
 *               type: string
 *               description: エラー・メッセージ
 *               example: weightは必須です
 */
exports.getHealthcare = functions.https.onRequest((request, response) => {
 if(typeof(request.query.weight) == "undefined") {
  response.status(400).json({"error_message": "weightは必須です"});
  return;
 }
 if(typeof(request.query.height) == "undefined") {
  response.status(400).json({"error_message": "heightは必須です"});
  return;
 }
 var weight = request.query.weight;
 var height = request.query.height;

 response.status(200).json(getMedicalParams(weight, height));
});


function getMedicalParams(weight, height) {
  // BMIの算出
  var bmi = Math.floor((weight * 10000 / (height * height)) * 100) / 100;

  // 適正体重の算出
  var suitable_weight = (height * height * 22) / 10000;

  return {
    "bmi":bmi,
    "suitable_weight":suitable_weight
  };
}

//swaggerの基本定義
var options = {
 swaggerDefinition: {
  info: {
   title: "ヘルスケアAPI",
   description: "身長と体重を渡すとBMI,適正体重、肥満度を返してくれます",
   version: "1.0.0."
  },
  basePath: '/',
  schemes: ["https"],
 },
 apis: ["./index.js"] //自分自身を指定。外部化した場合は、そのファイルを指定。配列で複数指定も可能。
};

var swaggerSpec = swaggerJSDoc(options);

//swaggerを返すAPI
exports.api_docs = functions.https.onRequest((request, response) => {
 response.setHeader("Content-Type", "text/plain");
 response.send(swaggerSpec);
});
