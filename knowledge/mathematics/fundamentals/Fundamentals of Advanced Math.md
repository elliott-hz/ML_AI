# Function
## Definition of Function
+ The relationship between **quantities** is like: $ A = \pi r^2 $
+ $ y = f(x) $, where $ x $is the **independent variable** and $ y $is the **dependent variable**.
+ The function value of the function at $ x_0 $is $ y_0 = y\big|_{x = x_0} = f(x_0) $
+ Symbols are just a kind of representation. It can also be: $ y = g(x) $, $ y = \varphi(x) $, $ y = \psi(x) $

## Types of Functions in Mathematics
+ **<font style="color:#DF2A3F;">Piecewise</font>**** ****<font style="color:#DF2A3F;">function</font>**: $ f(x)=\begin{cases}\sqrt{x},&x\geq0\\ -x,&x<0\end{cases} $
+ **<font style="color:#DF2A3F;">Inverse</font>**** ****<font style="color:#DF2A3F;">function</font>**: $ h = \frac{1}{2}gt^{2} \to h = h(t) $   $ t = \sqrt{\frac{2h}{g}} \to t = t(h) $

## Expression Type of Functions
+ **<font style="color:#DF2A3F;">Explicit function</font>**** and ****<font style="color:#DF2A3F;">implicit function</font>**: $ y = x^{2}+1 $, $ F(x,y)=0 $, $ 3x + y - 4 = 0 $

## Several Function Properties


+ **<font style="color:#DF2A3F;">Even-odd property</font>**:

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/21920074/1765619009305-3621788c-afe6-4302-9bc9-523ddbd014ed.png)<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/21920074/1765619023906-b4defad7-29d7-470d-ada2-0ff2bee30c82.png)

    - **Even function**: $ f(-x) = f(x) $, **<font style="color:#DF2A3F;">symmetric</font>** **about** **the** **<font style="color:#DF2A3F;">y-axis</font>**. 
        * For example $ f(x) = x^2 $, $ f(-x) = (-x)^2 = x^2 = f(x) $
    - **Odd function**: $ f(-x) = -f(x) $, **<font style="color:#DF2A3F;">symmetric</font>** **about** **the** **<font style="color:#DF2A3F;">origin</font>**. 
        * For example  $ f(x)=x^3 $,$ f(-x)=(-x)^3 = -x^3 = -f(x) $
+ **Periodicity**: $ f(x + T) = f(x) $.    <font style="color:rgba(0, 0, 0, 0.498);">/ˌpɪərɪəˈdɪsɪti/</font>

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/21920074/1765619054183-4492173b-c0a3-4491-85e9-fc6b905b3a3f.png)

+ **Monotonicity**:		<font style="color:#8A8F8D;">/ˌmɑː.nə.təˈnɪs.ə.t̬i/</font>
    - **monotonic increasing**: In the interval$ [a, b] $, when $ x_1 < x_2 $, $ f(x_1) < f(x_2) $  <font style="color:rgba(0, 0, 0, 0.498);">/ˌmɒnəˈtɒnɪk/</font>
    - **monotonic decreasing**: In the interval$ [a, b] $, when $ x_1 > x_2 $, $ f(x_1) > f(x_2) $

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/21920074/1758367500135-bc6a0c84-674a-4fe1-83d9-1fb4012b3fcd.png)

[https://colab.research.google.com/drive/1OLA1KHdGU5lZwZzNfJ_VL4nFVho_BL4a#scrollTo=8C_pR78x18EL&line=31&uniqifier=1](https://colab.research.google.com/drive/1OLA1KHdGU5lZwZzNfJ_VL4nFVho_BL4a#scrollTo=8C_pR78x18EL&line=31&uniqifier=1)

# Limit
## Sequence
### General Term
+ A **sequence** is a list of numbers arranged in a certain order:

$ u_1, u_2, \cdots, u_n, \cdots $

where $ u_n $ is called the **general term**.

### Sequence's convergency
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/21920074/1765619155589-74d0f9cd-c529-480b-a23a-639c794c70dd.png)

+ For a sequence $ \{u_n\} $, if as $ n $ increases without bound, its **general term** approaches a **constant** $ A $, then the sequence is said to have the **limit** $ A $, or equivalently, the sequence **converges** **to** $ A $. Otherwise, the sequence is said to **diverge**.

$ \lim_{n \to \infty} u_n = A, \quad \text{or} \quad u_n \to A \quad (n \to \infty) $

Examples:

$ \lim_{n \to \infty} \frac{1}{3^n} = 0, \quad 
\lim_{n \to \infty} \frac{n}{n+1} = 1, \quad 
\lim_{n \to \infty} 2^n \;\; \text{does not exist.} $

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/21920074/1765619177419-1964c7ad-54cf-4074-8555-b0563701634d.png)

## <font style="color:rgb(28, 31, 35);">Symbol representation</font>
$ x \to \infty $<font style="color:rgb(28, 31, 35);"> means when </font>$ |x| $<font style="color:rgb(28, 31, 35);">increases infinitely;</font>

$ x \to +\infty $<font style="color:rgb(28, 31, 35);">means when </font>$ x $**<font style="color:rgb(28, 31, 35);">increases</font>**<font style="color:rgb(28, 31, 35);"> infinitely;</font>

$ x \to -\infty $<font style="color:rgb(28, 31, 35);">means when </font>$ x $**<font style="color:rgb(28, 31, 35);">decreases</font>**<font style="color:rgb(28, 31, 35);"> infinitely;</font>

$ x \to x_0 $<font style="color:rgb(28, 31, 35);">means when </font>$ x $<font style="color:rgb(28, 31, 35);">approaches </font>$ x_0 $<font style="color:rgb(28, 31, 35);">infinitely from both the left and right sides of </font>$ x_0 $<font style="color:rgb(28, 31, 35);">;</font>

$ x \to x_0^+ $<font style="color:rgb(28, 31, 35);"> means when</font>$ x $<font style="color:rgb(28, 31, 35);">approaches </font>$ x_0 $<font style="color:rgb(28, 31, 35);">infinitely from the right side of </font>$ x_0 $<font style="color:rgb(28, 31, 35);">;</font>

$ x \to x_0^- $<font style="color:rgb(28, 31, 35);"> means when </font>$ x $<font style="color:rgb(28, 31, 35);">approaches </font>$ x_0 $<font style="color:rgb(28, 31, 35);">infinitely from the left side of </font>$ x_0 $<font style="color:rgb(28, 31, 35);">;</font>

## The limit of 3 types of function
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/21920074/1758413969753-7e389735-1599-471c-819a-fc97b3cc2f74.png)

[https://colab.research.google.com/drive/1OLA1KHdGU5lZwZzNfJ_VL4nFVho_BL4a#scrollTo=x9MD2-_fenKv&line=35&uniqifier=1](https://colab.research.google.com/drive/1OLA1KHdGU5lZwZzNfJ_VL4nFVho_BL4a#scrollTo=x9MD2-_fenKv&line=35&uniqifier=1)

### Exponential Function
$ y = e^{-x} $ is a form of the exponential function, where $ e $ is Euler’s number (the natural constant), approximately equal to 2.71828. The general form of an exponential function is $ y = a^x $ ($ a > 0 $ and $ a \neq 1 $). When $ a = e $, we obtain the exponential function with base $ e $.

+ **Properties**:
    - **Domain**: $ (-\infty, +\infty) $, meaning $ x $ can take any real number.
    - **Range**: $ (0, +\infty) $, the function value is always greater than 0.
    - **Monotonicity**: Since the exponent is $ -x $, the function is strictly decreasing. As $ x \to +\infty $, the value of $ e^{-x} $ becomes smaller and approaches 0, i.e., $ \lim_{x \to +\infty} e^{-x} = 0 $, The limit of e to the minus x, as x approaches positive infinity, equals zero (As x goes to positive infinity, e to the minus x goes to zero / When x gets very large, e to the minus x goes to zero)

### Reciprocal Function or Inverse Proportional Function
The general form of the reciprocal function is $ y = \frac{k}{x} $ ($ k $ is a nonzero constant). In $ y = \frac{1}{x} $, $ k = 1 $.

+ **Properties**:p
    - **Domain**: $ (-\infty, 0) \cup (0, +\infty) $, $ x $ cannot be 0.
    - **Range**: $ (-\infty, 0) \cup (0, +\infty) $, the function value cannot be 0.
    - **Monotonicity**: The function is strictly decreasing on both intervals $ (-\infty, 0) $ and $ (0, +\infty) $. As $ |x| \to \infty $, $ \tfrac{1}{x} $ approaches 0, i.e., $ \lim_{x \to \infty} \tfrac{1}{x} = 0 $, The limit of one over x, as x approaches infinity, equals zero. (As x goes to infinity, one over x goes to zero.)

### Arctangent Function
The arctangent function is the inverse of the tangent function $ y = \tan(x) $, restricted to the interval $ (-\tfrac{\pi}{2}, \tfrac{\pi}{2}) $.

+ **Properties**:
    - **Domain**: $ (-\infty, +\infty) $, $ x $ can take any real number.
    - **Range**: $ (-\tfrac{\pi}{2}, \tfrac{\pi}{2}) $, the function value lies between $ -\tfrac{\pi}{2} $ and $ \tfrac{\pi}{2} $.
    - **Monotonicity**: The function is strictly increasing. As $ x \to -\infty $, $ \arctan(x) $ approaches $ -\tfrac{\pi}{2} $, i.e., $ \lim_{x \to -\infty} \arctan(x) = -\tfrac{\pi}{2} $, The limit of arctangent of x, as x approaches negative infinity, equals negative pi over two (As x goes to minus infinity, arctan of x goes to negative pi over two).

## Two-Sided Limit and One-Sided Limits
### Two-Sided Limit
A function is defined in the neighborhood of $ x_0 $, $ \lim_{x \to x_0} f(x) = A $, or $ f(x) \to A \ (x \to x_0) $  
$ \lim_{x \to 1} \frac{x^2 - 1}{x - 1} = \lim_{x \to 1} \frac{(x - 1)(x + 1)}{x - 1} = 2 $



NB: (The limit, as x approaches 1, of (x squared minus 1) over (x minus 1), equals the limit, as x approaches 1, of (x minus 1) times (x plus 1) over (x minus 1), which equals 2) 

 (As x goes to 1, the limit of (x squared minus 1) over (x minus 1) is the same as the limit of (x minus 1)(x plus 1) over (x minus 1), and that equals 2.)

### One-Sided Limit
**Left and right limits**: The function is defined in the left half-neighborhood and right half-neighborhood

+ $ (x_0, x_0 + \delta) $.  -> The open interval from x naught to x naught plus delta.
+ $ (x_0 - \delta, x_0) $.  -> The open interval from x naught minus delta to x naught.

Then:

+ Left Limit:$ \lim_{x \to x_0^+} f(x) = A $, or $ f(x) \to A \ (x \to x_0^+) $ or $ f(x_0 + 0) = A $
+ Right Limit: $ \lim_{x \to x_0^-} f(x) = A $, or $ f(x) \to A \ (x \to x_0^-) $ or $ f(x_0 - 0) = A $

NB: The limit of f of x, as x approaches x naught from the right, equals A. / As x goes to x naught from the right, f of x goes to A.

NB: The limit of f of x, as x approaches x naught from the left, equals A, / As x goes to x anguth minus, f of x goes to A.

### Two-Sided and One-Sided Limit: Existence Condition
+ The **necessary and sufficient condition** for $ \lim_{x \to x_0} f(x) = A $ is $ \lim_{x \to x_0^-} f(x) = \lim_{x \to x_0^+} f(x) = A $.
+ Given the **piecewise function**:

$ f(x) = \begin{cases} x - 1, & x < 0 \\0, & x = 0 \\x + 1, & x > 0 \end{cases} $

+ For the limit of $ f(x) $ as $ x \to 0 $:

Solution:

$ \lim_{x \to 0^+} f(x) = \lim_{x \to 0^+} (x + 1) = 1 $

$ \lim_{x \to 0^-} f(x) = \lim_{x \to 0^-} (x - 1) = -1 $

The left-hand limit and the right-hand limit exist but are **not** **equal**.

Therefore, $ \lim_{x \to 0} f(x) $ does not exist.

## <font style="color:rgba(0, 0, 0, 0.85);">Infinitesimal and Basic Properties</font>
### What is Infinitesimal
A quantity whose limit is zero.     _<font style="color:#8A8F8D;"> </font>__<font style="color:#8A8F8D;">/ˌɪn.fɪ.nɪˈtes.ɪ.məl/</font>_

+ $ \lim_{x \to \infty} \frac{1}{x} = 0 $, so $ \frac{1}{x} $ is **an** **infinitesimal** as $ x \to \infty $.
+ $ \lim_{x \to 2} (3x - 6) = 0 $, so $ 3x - 6 $ is **an** **infinitesimal** **as** $ x \to 2 $.

### Basic properties
+ The **algebraic sum** of a finite number of infinitesimals is still an infinitesimal.    <font style="color:#8A8F8D;">/ˌæl.dʒəˈbreɪ.ɪk/</font>
+ The **product** of a finite number of infinitesimals is still an infinitesimal.
+ The **product** of a bounded variable and an infinitesimal is still an infinitesimal.
+ The **sum** of an infinite number of infinitesimals is not necessarily an infinitesimal.

$ \begin{align*}
&\lim_{n \to \infty} \left( \frac{1}{n^2} + \frac{2}{n^2} + \cdots + \frac{n}{n^2} \right) \\
=& \lim_{n \to \infty} \frac{\frac{n(n + 1)}{2}}{n^2} \\
=& \lim_{n \to \infty} \frac{n + 1}{2n} \\
=& \frac{1}{2}
\end{align*} $

**<font style="color:rgb(28, 31, 35);">Bounded</font>**<font style="color:rgb(28, 31, 35);"> </font>**<font style="color:rgb(28, 31, 35);">variable</font>**<font style="color:rgb(28, 31, 35);">: It refers to a variable whose values always lie within a definite range during a certain process (such as </font>$ x \to x_0 $<font style="color:rgb(28, 31, 35);"> or </font>$ x \to \infty $<font style="color:rgb(28, 31, 35);">etc.). That is to say, there exists a positive number </font>$ M $<font style="color:rgb(28, 31, 35);"> such that the absolute value of the variable is always less than or equal to </font>$ M $<font style="color:rgb(28, 31, 35);">, i.e., </font>$ |u(x)| \leq M $<font style="color:rgb(28, 31, 35);">. For example, for the function </font>$ y = \sin x $<font style="color:rgb(28, 31, 35);">, no matter what value </font>$ x $<font style="color:rgb(28, 31, 35);"> takes, </font>$ |\sin x| \leq 1 $<font style="color:rgb(28, 31, 35);">holds. Therefore, </font>$ \sin x $<font style="color:rgb(28, 31, 35);"> is a bounded variable.</font>

### <font style="color:rgba(0, 0, 0, 0.85);">The Quotient of Infinitesimals</font>
+ The quotient of infinitesimals is not necessarily an infinitesimal.       <font style="color:#8A8F8D;"> /ˈkwoʊ.ʃənt/</font>  
$ \lim_{x \to 0} \frac{x}{2x} = \frac{1}{2} $, $ \lim_{x \to 0} \frac{x^2}{2x} = 0 $, $ \lim_{x \to 0} \frac{2x}{x^2} = \infty $
+ Explanation

Suppose there are two infinitesimals $ f(x) $ and $ g(x) $. If both of them approach zero (that is, when $ x \to a $, $ f(x) \to 0 $ and $ g(x) \to 0 $), then $ \frac{f(x)}{g(x)} $ is not necessarily an infinitesimal either. This is because their ratio depends on the speed at which $ f(x) $ and $ g(x) $ approach zero:

        * If $ f(x) $ approaches zero faster than $ g(x) $, then $ \frac{f(x)}{g(x)} $ may still be an **infinitesimal**.
        * If $ g(x) $ approaches zero faster than $ f(x) $, then $ \frac{f(x)}{g(x)} $ may tend to **infinity**.
        * If $ f(x) $ and $ g(x) $ approach zero at the same speed, then $ \frac{f(x)}{g(x)} $ may tend to **a non-zero finite value**.a

## <font style="color:rgba(0, 0, 0, 0.85);">Relationship between limit and infinitesimal</font>
+ Relationship between limit and infinitesimal: The **necessary and sufficient condition** for $ \lim_{x \to x_0} f(x) = A $ is $ f(x) = A + \alpha(x) $, where $ \alpha(x) $ is an infinitesimal as $ x \to x_0 $.
+ Explanation
    - When the limit of the function $ f(x) $ as $ x \to x_0 $ is $ A $, it can be written in the following form:

$ f(x) = A + \alpha(x) $

Here, $ \alpha(x) $ is an infinitesimal that approaches zero as $ x \to x_0 $.

    - **Why**: It means that if $ \lim_{x \to x_0} f(x) = A $, then $ f(x) $ can be expressed as the constant $ A $ plus an infinitesimal $ \alpha(x) $. As $ x $ approaches $ x_0 $, $ \alpha(x) $ will tend to $ 0 $, so $ f(x) $ approaches $ A $.

 This expression shows that when $ x $ is close to $ x_0 $, the function $ f(x) $ can be regarded as a value "close" to $ A $ plus a very small error term $ \alpha(x) $.

## Infinity and The Difference from Infinitesimal
### What is Infinity
+ **Infinity**: It is not a very large number, but relative to the transformation process.  
$ \lim_{x \to x_0} f(x) = \infty $ or $ f(x) \to \infty \ (x \to x_0) $
+ **Relationship** **between** **infinitesimal** **and** **infinity**: In the same process of the independent variable's transformation, if $ f(x) $ is an infinity, then $ \frac{1}{f(x)} $ is an infinitesimal.

### **Infinitesimal vs Infinity**
+ **Infinitesimal** has a **strict mathematical definition**: a quantity $ \alpha(x) $ is infinitesimal as $ x \to x_0 $ if

$ \lim_{x \to x_0} \alpha(x) = 0 $

      This is precise and absolute: the value tends to zero.

+ **Infinity**, on the other hand, is not a “number” in the usual sense. When we write

$ \lim_{x \to x_0} f(x) = \infty $

      it means that the values of $ f(x) $ **grow beyond any finite bound** as $ x $ approaches $ x_0 $.

### **Why “relative to the transformation process”**
+ Infinity is **not absolute**; it depends on the process of the independent variable changing. For example:
    - $ f(x) = x^2 $ as $ x \to \infty $: $ f(x) \to \infty $
    - $ g(x) = \frac{1}{x} $ as $ x \to 0^+ $: $ g(x) \to \infty $ in the sense of the reciprocal going very large
+ In both cases, “infinity” is **relative** to how $ x $ approaches the limit point: the function values just become arbitrarily large **compared to any finite number**, but there is no actual “infinity number.”

_<font style="color:#8A8F8D;">/ˌɑːr.bəˈtrer.əl.i/</font>_

### **Comparison Table**
| Concept | Strict Definition? | Absolute? | Notes |
| --- | --- | --- | --- |
| Infinitesimal | ✅ Yes | ✅ Absolute: tends to 0 | $ \lim_{x \to x_0} \alpha(x) = 0 $ |
| Infinity | ❌ No | ❌ Relative to the limiting process | Function grows beyond all bounds; depends on how $ x $ approaches $ x_0 $ |


So the wording **“relative to the transformation process”** is highlighting that infinity is not a fixed number — it’s about how the function behaves as $ x $ moves toward a point.

## Basic Standard Limit Values
"Basic limit results" refer to some standard limit values commonly used in limit calculations. These limit values are usually proven and widely accepted. For example, in calculus, there are several very important basic limit values, including:

1. $ \lim_{x \to 0} \frac{\sin x}{x} = 1 $
2. $ \lim_{x \to 0} \frac{1 - \cos x}{x^2} = \frac{1}{2} $
3. $ \lim_{x \to 0} \frac{\tan x}{x} = 1 $
4. $ \lim_{x \to \infty} \left(1 + \frac{1}{x}\right)^x = e $

These results are very useful when dealing with limits, especially in limit problems involving trigonometric functions, exponential functions, or logarithmic functions. With these basic limit results, we can calculate complex limits more easily.    

<font style="color:#8A8F8D;">trigonometric -> /ˌtrɪɡ.ə.nəˈmet.rik/ </font>

<font style="color:#8A8F8D;">logarithmic -> /ˌlɑː.ɡəˈrɪθ.mɪk/</font>

# Continuity of a Function
<font style="color:#8A8F8D;">/ˌkɒn.tɪˈnjuː.ə.ti/. pay attention to the pronounce</font>

## What's Continuity of a Function
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/21920074/1758420904954-a407ad3b-009b-4c05-bd2e-43c8b05e2c39.png)

[https://colab.research.google.com/drive/1OLA1KHdGU5lZwZzNfJ_VL4nFVho_BL4a#scrollTo=EtRIotnlDIew&line=3&uniqifier=1](https://colab.research.google.com/drive/1OLA1KHdGU5lZwZzNfJ_VL4nFVho_BL4a#scrollTo=EtRIotnlDIew&line=3&uniqifier=1)

Suppose the function $ y = f(x) $ is defined in some neighborhoodn  of the point $ x_0 $. If, as the change in the independent variable $ \Delta x $ approaches zero, the corresponding change in the function $ \Delta y $ also approaches zero, then $ y = f(x) $ is said to be continuous at the point $ x_0 $.

$ \lim_{\Delta x \to 0} \Delta y = \lim_{\Delta x \to 0} \left[ f(x_0 + \Delta x) - f(x_0) \right] = 0 $

+ For $ y = f(x) $: When $ \Delta x \to 0 $, $ \Delta y \to 0 $;
+ For $ y = g(x) $: When $ \Delta x \to 0^+ $, $ \Delta y $ cannot approach 0.

## <font style="color:rgb(0, 0, 0);">Continuity Conditions of a Function at a Point</font>
### Conditions
The function $ f(x) $ is continuous at the point $ x_0 $, and the conditions to be satisfied are:

+ The function is defined at $ x_0 $.
+ The limit $ \lim_{x \to x_0} f(x) $ exis ts at this point.
+ The limit value is equal to the function value $ f(x_0) $.

### Example
Is the function $ f(x) = \begin{cases} x + 1, & x \leq 0 \\ \frac{\sin x}{x}, & x > 0 \end{cases} $continuous at $ x = 0 $?

+ At the point of $ x=0 $->$ f(0) = 1 $
+ Left Limit: $ \lim_{x \to 0^-} f(x) = \lim_{x \to 0^-} (x + 1) = 1 $
+ Right Limit:$ \lim_{x \to 0^+} f(x) = \lim_{x \to 0^+} \frac{\sin x}{x} = 1 $
+ Two-Sided Limit:$ \lim_{x \to 0} f(x) = 1 $

Therefore -> $ \lim_{x \to 0} f(x) = f(0) = 1 $

## <font style="color:rgb(0, 0, 0);">Discontinuity Points of a Function</font>
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/21920074/1765619263797-cabb7557-d59e-4c10-b585-ba477570ecce.png)

### Discountinuity Points Definition and Conditions
<font style="color:#8A8F8D;">/ˌdɪs.kɒn.tɪˈnjuː.ə.ti/.  pay attention to the pronounce</font>

+ If the function $ f(x) $ is discontinuous at the point $ x = x_0 $, then $ x_0 $ is called a discontinuity point of the function.
+ There are 3 cases for a discontinuity point:
    1. The function $ f(x) $ is not defined at the point $ x_0 $.
    2. The limit $ \lim_{x \to x_0} f(x) $ does not exist.
    3. The first two points are satisfied, but $ \lim_{x \to x_0} f(x) \neq f(x_0) $.

### First-kind discontinutiy point and Second-kind discontinuity point
+ When $ x \to x_0 $, if both the left-hand limit and the right-hand limit of $ f(x) $ exist, then $ x_0 $ is called a **first-kind discontinuity point** of $ f(x) $; otherwise, it is a **second-kind discontinuity point**.
+ **Jump discontinuity point**: Both $ \lim_{x \to x_0^-} f(x) $ and $ \lim_{x \to x_0^+} f(x) $ exist, but they are not equal.
+ **Removable discontinuity point**: $ \lim_{x \to x_0} f(x) $ exists and equal in both sides, but is not equal to $ f(x_0) $.

#### Jump Discontinuity Point
+ **Definition**: At a point $ c $, if the left-hand limit $ \lim_{x \to c^-} f(x) $ and the right-hand limit $ \lim_{x \to c^+} f(x) $ both exist, but these two limits are not equal (that is, $ \lim_{x \to c^-} f(x) \neq \lim_{x \to c^+} f(x) $), then the point $ c $ is a jump discontinuity point.
+ **Characteristics**:
    - **Existence of left and right limits**: There are limit values on the left and right sides of point $ c $.
    - **Unequal limits**: There is an obvious "jump" between the left-hand limit and the right-hand limit, which makes the function discontinuous at this point.
+ **Example**:  
 Consider the function:

$ f(x) = 
  \begin{cases} 
  2 & \text{if } x < 1 \\
  5 & \text{if } x \geq 1 
  \end{cases} $

  	At $ x = 1 $, $ \lim_{x \to 1^-} f(x) = 2 $ and $ \lim_{x \to 1^+} f(x) = 5 $, so $ x = 1 $ is a jump discontinuity.

#### Removable Discontinuity Point
+ **Definition**: At a point $ c $, if the left-hand limit and the right-hand limit of the function both exist and are equal, that is, $ \lim_{x \to c^-} f(x) = \lim_{x \to c^+} f(x) = L $, but the value of the function at $ c $, $ f(c) $, is not equal to $ L $ or $ f(c) $ is undefined, then the point $ c $ is a removable discontinuity point.
+ **Characteristics**:
    - **Existence of left and right limits and they are equal**: The limit values on the left and right sides are the same.
    - **The function value is undefined or different**: The actual value of the function at this point is different from the limit value, or the value of the function at this point is undefined.
    - **Removable**: This discontinuity can be eliminated by appropriately defining $ f(c) $ to be equal to $ L $, making the function continuous at this point.
+ **Example**:  
Consider the function:

$ f(x) = \frac{\sin x}{x} \ (x \neq 0) $

  At $ x = 0 $, $ \lim_{x \to 0} f(x) = 1 $, but $ f(0) $ is undefined. Therefore, $ x = 0 $ is a removable discontinuity. We can remove this discontinuity by defining $ f(0) = 1 $, making the function continuous at $ x = 0 $.

# Derivative
## Movtivation for the Derivative
+ **Average velocity**: (Velocity) $ v = \frac{s \ (\text{distance})}{t \ (\text{time})} $, but how to express **instantaneous velocity?**
+ **Instantaneous distance travelled**: $ \Delta s = s(t_0 + \Delta t) - s(t_0) $

tDelta s equals s of t naught plus delta t minus s of t naught.

+ **Average velocity over this small interval**: $ \overline{v} = \frac{\Delta s}{\Delta t} = \frac{s(t_0 + \Delta t) - s(t_0)}{\Delta t} $

<font style="color:rgb(29, 42, 87);">v bar equals delta s over delta t, which is s of t naught plus delta t minus s of t naught, all over delta t.</font>

+ When $ \Delta t \to 0 $, it is the instantaneous velocity:

$ v(t_0) = \lim_{\Delta t \to 0} \overline{v} = \lim_{\Delta t \to 0} \frac{\Delta s}{\Delta t} = \lim_{\Delta t \to 0} \frac{s(t_0 + \Delta t) - s(t_0)}{\Delta t} $

## Derivative and its presentation
If the limit of the average rate of change exists, $ \lim\limits_{\Delta x \to 0} \frac{\Delta y}{\Delta x} = \lim\limits_{\Delta x \to 0} \frac{f(x_0 + \Delta x) - f(x_0)}{\Delta x} $, then **this limit is called** **the derivative of the function **$ y = f(x) $** at the point **$ x_0 $, denoted as:

+  $ f'(x_0) $		_<font style="color:#8A8F8D;">f prime of x naught / f prime at x zero</font>_
+ $ \left. y' \right\rvert_{x = x_0} $		_<font style="color:#8A8F8D;">y prime evaluated at x equals x naught / y prime at x naught</font>_
+ $ \left. \frac{dy}{dx} \right\rvert_{x = x_0} $		_<font style="color:#8A8F8D;">dee y dee x evaluated at x equals x naught / the derivative dy/dx at x naught</font>_
+ $ \left. \frac{df(x)}{dx} \right\rvert_{x = x_0} $	<font style="color:#8A8F8D;">dee f of x dee x evaluated at x equals x naught / the derivative of f of x with respect to x at x naught</font>

## Basic Derivative Formulas
1. $ (C)' = 0 $: The derivative of a constant is 0. That is to say, if a function is a fixed value (not changing with $ x $), then its slope is 0.
2. $ (x^\mu)' = \mu x^{\mu - 1} $: The derivative of a power function. For example, the derivative of $ x^3 $ is $ 3x^2 $.
3. $ (\sin x)' = \cos x $: The derivative of the sine function is the cosine function.
4. $ (\cos x)' = -\sin x $: The derivative of the cosine function is the negative of the sine function.
5. $ (\tan x)' = \sec^2 x $: The derivative of the tangent function is the square of the secant function.
6. $ (\cot x)' = -\csc^2 x $: The derivative of the cotangent function is the negative of the square of the cosecant function.
7. $ (\sec x)' = \sec x \tan x $: The derivative of the secant function is the secant multiplied by the tangent.
8. $ (\csc x)' = -\csc x \cot x $: The derivative of the cosecant function is the negative of the cosecant multiplied by the cotangent.
9. $ (a^x)' = a^x \ln a $: The derivative of an exponential function. For example, the derivative of $ e^x $ is $ e^x $ itself.
10. $ (e^x)' = e^x $: The derivative of the exponential function with the natural logarithm base is still itself.
11. $ (\log_a x)' = \frac{1}{x \ln a} $: The derivative of a logarithmic function with base $ a $.
12. $ (\ln x)' = \frac{1}{x} $: The derivative of the natural logarithmic function is its reciprocal.
13. $ (\arcsin x)' = \frac{1}{\sqrt{1 - x^2}} $: The derivative of the arcsine function.
14. $ (\arccos x)' = -\frac{1}{\sqrt{1 - x^2}} $: The derivative of the arccosine function.
15. $ (\arctan x)' = \frac{1}{1 + x^2} $: The derivative of the arctangent function.
16. $ (\text{arc cot } x)' = -\frac{1}{1 + x^2} $: The derivative of the arccotangent function.

## Differentiation rules
<font style="color:rgba(0, 0, 0, 0.85);">These are some </font>**<font style="color:rgb(0, 0, 0) !important;">differentiation rules</font>**<font style="color:rgba(0, 0, 0, 0.85);"> which can describe how to find the derivatives of combinations of functions (such as </font>**<font style="color:rgba(0, 0, 0, 0.85);">sums</font>**<font style="color:rgba(0, 0, 0, 0.85);">, </font>**<font style="color:rgba(0, 0, 0, 0.85);">differences</font>**<font style="color:rgba(0, 0, 0, 0.85);">, </font>**<font style="color:rgba(0, 0, 0, 0.85);">products</font>**<font style="color:rgba(0, 0, 0, 0.85);">, </font>**<font style="color:rgba(0, 0, 0, 0.85);">quotients</font>**<font style="color:rgba(0, 0, 0, 0.85);">, and functions multiplied by constants).  </font>_<font style="color:#8A8F8D;">/ˈkwəʊ.ʃ</font>__<font style="color:#8A8F8D;">ə</font>__<font style="color:#8A8F8D;">nt/</font>_

<font style="color:rgb(29, 42, 87);"></font>

1. $ (u \pm v)' = u' \pm v' $
    - The derivative of a sum or difference of two functions is the sum or difference of their derivatives.
2. $ (uv)' = u'v + uv' $
    - The derivative of a product of two functions is given by the first times the derivative of the second plus the second times the derivative of the first.
3. $ \left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2} (v \neq 0) $
    - The derivative of a quotient of two functions is the **denominator** times the derivative of the **numerator** minus the numerator times the derivative of the denominator, all divided by the denominator squared.		_<font style="color:#8A8F8D;">/ˈnjuː.mə.reɪ.tə</font>__<font style="color:#8A8F8D;">r</font>__<font style="color:#8A8F8D;">/ and /dɪˈnɒm.ɪ.neɪ.tə</font>__<font style="color:#8A8F8D;">r</font>__<font style="color:#8A8F8D;">/</font>_
4. $ (Cu)' = Cu' $ **(where **$ C $** is a constant)**
    - The derivative of a constant multiplied by a function is the constant multiplied by the derivative of the function.
5. $ \left(\frac{C}{v}\right)' = -\frac{Cv'}{v^2} $** (where **$ C $** is a constant)**
    - The derivative of a constant divided by a function is the negative constant times the derivative of the function divided by the square of the function.

# Partial Derivative
## Motivation of Partial Derivative (The Change Rate of a Function)
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/21920074/1758440793971-39d9f7e1-8e66-4a07-8f22-454281c32125.png)<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/21920074/1758440902849-87e7b419-d618-4524-9e70-ece99687eb2f.png)

[https://colab.research.google.com/drive/1OLA1KHdGU5lZwZzNfJ_VL4nFVho_BL4a#scrollTo=uA5slBcMNvrj&line=59&uniqifier=1](https://colab.research.google.com/drive/1OLA1KHdGU5lZwZzNfJ_VL4nFVho_BL4a#scrollTo=uA5slBcMNvrj&line=59&uniqifier=1)

+ For a **unary** **function** $ y = f(x) $, there is only the change of $ y $ with respect to $ x $. _<font style="color:#8A8F8D;">/ˈjuː.nə.ri/</font>_
+ For a **binary** **function** $ z = f(x, y) $, there exist:
    - the rate of change of $ z $ with respect to $ x $
    - the rate of change of $ z $with respect to $ y $
    - and the rate of change with respect to the simultaneous change of $ x $ and $ y $

## Definition of Partial Derivative
+ **Definition**:  Suppose the function $ z = f(x, y) $ is defined in some neighborhood of the point $ (x_0, y_0) $. Fix $ y = y_0 $, and the unary function $ f(x, y_0) $ is differentiable at the point $ x = x_0 $, that is, the limit

$ \lim\limits_{\Delta x \to 0} \frac{f(x_0 + \Delta x, y_0) - f(x_0, y_0)}{\Delta x} = A $ exists.

+ Then $ A $ is called the **partial derivative** of the function $ z = f(x, y) $ with respect to the independent variable $ x $ at the point $ (x_0, y_0) $.
+ It is denoted as:
    - $ f_x(x_0, y_0) $ _<font style="color:#8A8F8D;">- f sub x of x naught, y naught / f x at (x naught, y naught)</font>_
    - $ \left. \frac{\partial z}{\partial x} \right\rvert_{\substack{x = x_0 \\ y = y_0}} $
        * _<font style="color:#8A8F8D;">partial z partial x, evaluated at x equals x naught, y equals y naught</font>_
        * _<font style="color:#8A8F8D;">the partial derivative of z with respect to x at (x naught, y naught)</font>_
    -  $ \left. \frac{\partial f}{\partial x} \right\rvert_{\substack{x = x_0 \\ y = y_0}} $
        * _<font style="color:#8A8F8D;">partial f partial x, evaluated at x equals x naught, y equals y naught</font>_
        * _<font style="color:#8A8F8D;">the partial derivative of f with respect to x at (x naught, y naught)</font>_
    -  $ \left. z_x \right\rvert_{\substack{x = x_0 \\ y = y_0}} $
        * _<font style="color:#8A8F8D;">z sub x, evaluated at x equals x naught, y equals y naught</font>_
        * _<font style="color:#8A8F8D;">z x at (x naught, y naught)</font>_

## Geometric meaning
+ **Geometric meaning**: $ \left. \frac{\partial f}{\partial x} \right\rvert_{\substack{x = x_0 \\ y = y_0}} = \left. \frac{\mathrm{d}}{\mathrm{d}x} f(x, y_0) \right\rvert_{x = x_0} $ is the slope of the **tangent line** $ M_0T_x $ at point $ M_0 $ with respect to the $ x-axis $ for the curve $ \begin{cases} z = f(x, y) \\ y = y_0 \end{cases} $.

_<font style="color:#8A8F8D;">partial f partial x, evaluated at x equals x naught, y equals y naught, equals d by d x of f of x, y naught, evaluated at x equals x naught.</font>_

_<font style="color:#8A8F8D;">or the partial derivative of f with respect to x at (x naught, y naught) equals the ordinary derivative of f of x, y naught with respect to x at x naught.</font>_

+ **Geometric meaning**: $ \left. \frac{\partial f}{\partial y} \right\rvert_{\substack{x = x_0 \\ y = y_0}} = \left. \frac{\mathrm{d}}{\mathrm{d}y} f(x_0, y) \right\rvert_{y = y_0} $ is the slope of the **tangent line** $ M_0T_y $ at point $ M_0 $ with respect to the $ y-axis $ for the curve $ \begin{cases} z = f(x, y) \\ x = x_0 \end{cases} $.

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/21920074/1765618883955-15339942-d2be-4e9a-a705-59424c4e19bb.png)

## Calculation Example
Find the partial derivatives of $ f(x, y) = x^2 + 3xy + y^2 $ at the point $ (1, 2) $.

$ f_x(x, y) = 2x + 3y $

$ f_y(x, y) = 3x + 2y $

$ f_x(1, 2) = \left. (2x + 3y) \right\rvert_{\substack{x = 1 \\ y = 2}} = 8 $

$ f_y(1, 2) = \left. (3x + 2y) \right\rvert_{\substack{x = 1 \\ y = 2}} = 7 $

# <font style="color:rgba(0, 0, 0, 0.85);">Directional Derivative</font>
[https://www.bilibili.com/video/BV1DE421M7AZ/?spm_id_from=333.999.0.0&vd_source=45a718d09573b9b89d246c8e5ca3963a](https://www.bilibili.com/video/BV1DE421M7AZ/?spm_id_from=333.999.0.0&vd_source=45a718d09573b9b89d246c8e5ca3963a)

## Motivation of Directional Derivative


<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/21920074/1758444191557-af8cb9ca-8af5-4641-9a09-f07e2c25f826.png)<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/21920074/1758444208206-757a791c-12e1-4383-91e4-fafb179f3364.png)



Q: In which direction should the ant run to survive?

Function: $ z = f(x, y) $

$ |PP'| = \rho = \sqrt{(\Delta x)^2 + (\Delta y)^2} $

$ \Delta z = f(x + \Delta x, y + \Delta y) - f(x, y) $

## Definition of Directional Derivative
+ **Definition**: If the **ratio** of **the increment of a function** to **the distance between two points exists**, this ratio is called the **directional derivative** of the function at point $ P $ along a direction $ L $.

$ \frac{\partial f}{\partial l} = \lim_{\rho \to 0} \frac{f(x + \Delta x, y + \Delta y) - f(x, y)}{\rho} $

+ **Function:** For $ f(x, y) $, the directional derivatives along the positive $ X $axis $ \vec{e_1} = \{1, 0\} $and the positive $ Y $axis $ \vec{e_2} = \{0, 1\} $ are $ f_x $and $ f_y $, respectively.  
The directional derivatives along the negative directions of the axes are $ -f_x $ and $ -f_y $.

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/21920074/1758445201838-991890b0-9dc2-4d4e-8428-71107720c6a6.png)



**x:** If the function $ z = f(x, y) $ is **differentiable** at a point $ P(x, y) $, then the directional derivative at this point exists along **any direction** $ L $.

$ \frac{\partial f}{\partial l} = \frac{\partial f}{\partial x} \cos\varphi + \frac{\partial f}{\partial y} \sin\varphi $

_<font style="color:#8A8F8D;">The partial of f with respect to l equals the partial of f with respect to x times cosine phi, plus the partial of f with respect to y times sine phi.</font>_

_<font style="color:#8A8F8D;">or The directional derivative of f along l is equal to the partial derivative of f with respect to x times cos φ, plus the partial derivative of f with respect to y times sin φ.</font>_

Here, $ \varphi $ is the angle between the positive $ X $axis and the direction $ L $.

## Example
+ **Question**: Find the directional derivative of the function $ z = xe^{2y} $at point $ P(1, 0) $ in the direction from point $ P(1, 0) $ to point $ Q(2, -1) $.
+ **Solution:** Here, the direction vector $ \vec{l} $ is$ \overrightarrow{PQ} = \{1, -1\} $

Therefore, the angle $ \varphi $from the $ x $axis to the direction$ \vec{l} $ is$ \varphi = -\frac{\pi}{4} $.

Since  $ \left. \frac{\partial z}{\partial x} \right|_{(1, 0)} = \left. e^{2y} \right|_{(1, 0)} = 1, \quad \left. \frac{\partial z}{\partial y} \right|_{(1, 0)} = \left. 2xe^{2y} \right|_{(1, 0)} = 2 $,

Therefore, the required directional derivative is:$ \frac{\partial z}{\partial l} = \cos\left(-\frac{\pi}{4}\right) + 2\sin\left(-\frac{\pi}{4}\right) = -\frac{\sqrt{2}}{2} $.

+ **The chain rule: **To handle this problem, we use the chain rule and the product rule. First, notice that $ e^{2y} $ is an exponential function, and $ 2y $ is twice $ y $. When we take the derivative of $ e^{2y} $, we need to apply the **chain rule**, which means multiplying the derivative of the outer function (here, the exponential function) by the derivative of the inner function (here, $ 2y $).

The specific steps are as follows:

    - **Outer function**: $ e^u $, where $ u = 2y $
        * Derivative: $ \frac{d}{du} e^u = e^u $
    - **Inner function**: $ u = 2y $
        * Derivative: $ \frac{d}{dy} 2y = 2 $
    - **Apply the chain rule**: $ \frac{d}{dy} e^{2y} = e^{2y} \times 2 = 2e^{2y} $

# Gradient
## Definition of Gradient
+ Gradient describes the direction and rate of change of a function at a certain point. Simply put:
    - **Direction of the gradient**: Points to the direction where the function grows the fastest.
    - **Magnitude of the gradient**: Indicates how fast the function changes along this direction.
+ **Function**: $ z = f(x, y) $ has continuous first-order partial derivatives in a plane domain. For each point $ P(x, y) $ in it, there is a vector $ \frac{\partial f}{\partial x}\vec{i} + \frac{\partial f}{\partial y}\vec{j} $, which is called the gradient of the function at point $ P $.

$ \text{grad}f(x, y) = \frac{\partial f}{\partial x}\vec{i} + \frac{\partial f}{\partial y}\vec{j} $

_<font style="color:#8A8F8D;">The gradient of f(x,y) equals partial f with respect to x times vector i, plus partial f with respect to y times vector j.</font>_

_<font style="color:#8A8F8D;">or grad f of x, y equals f sub x i-hat plus f sub y j-hat.</font>_

+ **Unit Vector in the direction**

 $ L $: $ \vec{e} = \cos\varphi\vec{i} + \sin\varphi\vec{j} $_<font style="color:#8A8F8D;">		Vector e equals cosine phi times i-hat plus sine phi times j-hat.</font>_

$ \begin{align*}
\frac{\partial f}{\partial l} &= \frac{\partial f}{\partial x}\cos\varphi + \frac{\partial f}{\partial y}\sin\varphi = \left\{ \frac{\partial f}{\partial x}, \frac{\partial f}{\partial y} \right\} \cdot \{ \cos\varphi, \sin\varphi \} \\
&= \text{grad}f(x, y) \cdot \vec{e} = |\text{grad}f(x, y)| \cos\theta \quad (\theta = (\text{grad}f(x, y), \vec{e}))
\end{align*} $

## Explanation of the Formula
$ \text{grad}f(x, y) = \frac{\partial f}{\partial x}\mathbf{i} + \frac{\partial f}{\partial y}\mathbf{j} $

Where:

+ $ \frac{\partial f}{\partial x} $: Represents the **partial derivative** of the function $ f(x, y) $ with respect to $ x $, describing the rate of change of $ f $ in the $ x $direction.
+ $ \frac{\partial f}{\partial y} $: Represents the **partial derivative** of the function $ f(x, y) $ with respect to $ y $, describing the rate of change of $ f $ in the $ y $direction.
+ $ \mathbf{i}, \mathbf{j} $ are unit vectors:
    - $ \mathbf{i} $ represents the unit vector in the $ x $direction, usually written as $ (1, 0) $.
    - $ \mathbf{j} $ represents the unit vector in the $ y $direction, usually written as $ (0, 1) $.

Essentially, the gradient is a vector that tells you the direction of change of the function $ f(x, y) $ at a certain point.

## Example
+ **Binary Function and calculate the gradient of point **$ (1,1) $**, **$ (-1,-1) $** and **$ (0,0) $

the original function is: $ f(x, y) = x^2 + y^2 $

+ **Calculate the Gradient**
    - **Partial derivative with respect to **$ x $:

$ \frac{\partial f}{\partial x} = 2x $

    - **Partial derivative with respect to **$ y $:

$ \frac{\partial f}{\partial y} = 2y $

    - **So the gradient is**:

$ \text{grad}f(x, y) = (2x, 2y) $

+ **Calculating the Gradient**
    - **Calculate the gradient at point **$ (1, 1) $:$ \text{grad}f(1, 1) = (2, 2) $

This indicates that at point $ (1, 1) $, the direction in which the function increases the fastest is towards $ (2, 2) $, that is, along the direction $ x = y $.

    - **Calculate the gradient at point **$ (-1, -1) $:$ \text{grad}f(-1, -1) = (-2, -2) $

This indicates that at point $ (-1, -1) $, the direction in which the function increases the fastest is towards $ (-2, -2) $, that is, along the opposite direction of $ x = y $.

    - **Calculate the gradient at point **$ (0, 0) $:$ \text{grad}f(0, 0) = (0, 0) $

This indicates that at the origin, the gradient is zero, and the function has no change (it is at an extreme point).

# Appendix: Analysis of Common Trigonometric Functions
[http://www.360doc.com/content/24/0421/17/35070365_1121042275.shtml](http://www.360doc.com/content/24/0421/17/35070365_1121042275.shtml)



