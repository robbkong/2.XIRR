文件夹：other

说明：测试计算XIRR函数，发现其有BUG：当XIRR计算出来是正数的时候，其计算正确。但是，当计算值小于-0.5左右，就会出现错误。

文件：

1. 1.XIRR.html： 正常的XIRR的计算
2. 2.error.html：错误的XIRR的计算
3. moment.js：XIRR计算需要的函数
4. XIRR.xlsx：正常的，通过EXCEL计算的值
