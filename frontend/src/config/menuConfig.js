const menuConfig = {
  "menu": [
    {
      "id": "mathematics",
      "name": "Mathematics",
      "children": [
        {
          "id": "math_1",
          "name": "1_Fundamentals of Advanced Math",
          "children": [
            {
              "id": "math_1_1",
              "name": "1_1_basic function",
              "path": "/mathematics/1-fundamentals/basic-function",
              "component": "BasicFunction"
            },
            {
              "id": "math_1_2",
              "name": "1_2_limit",
              "path": "/mathematics/1-fundamentals/limit",
              "component": "Limit"
            },
            {
              "id": "math_1_3",
              "name": "1_3_continuity",
              "path": "/mathematics/1-fundamentals/continuity",
              "component": "Continuity"
            }
          ]
        },
        {
          "id": "math_2",
          "name": "2_calculus",
          "children": [
            {
              "id": "math_2_1",
              "name": "2_1_derivative",
              "path": "/mathematics/2-calculus/derivative",
              "component": "Derivative"
            }
          ]
        }
      ]
    },
    {
      "id": "deep-learning",
      "name": "Deep Learning",
      "children": [
        {
          "id": "dl_1",
          "name": "1_Neural Networks Basics",
          "children": [
            {
              "id": "dl_1_1",
              "name": "1_1_perceptron",
              "path": "/deep-learning/1-neural-networks/perceptron",
              "component": "Perceptron"
            }
          ]
        }
      ]
    },
    {
      "id": "machine-learning",
      "name": "Machine Learning",
      "children": [
        {
          "id": "ml_1",
          "name": "1_Supervised Learning",
          "children": [
            {
              "id": "ml_1_1",
              "name": "1_1_linear_regression",
              "path": "/machine-learning/1-supervised/linear-regression",
              "component": "LinearRegression"
            }
          ]
        }
      ]
    }
  ]
};

export default menuConfig;
