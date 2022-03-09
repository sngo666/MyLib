var sumOddLengthSubarrays = function(arr) {
    let sum = 0, len = arr.length, j, k, temp;
    console.log(len);
    for (let i=1; i<=len; i+=2){
        k = len%2==0 ? len/2-1 : (len-1)/2;
        temp = len-i+1<i ? len-i+1 : i;
        console.log('i= ' + i + ',' + 'temp= ' + temp + ',' + 'k= ' + k);
        for (j=0; j<=k; j++){
            if (len%2 == 0){
                if ((j+1) <= temp ){
                    sum += (j+1) * (arr[j] + arr[len-j-1]);
                }else{
                    sum += temp * (arr[j] + arr[len-j-1]);
                }
            }else{
                if(j == k){
                    sum += temp * arr[k];
                }else {
                    if ((j+1) <= temp){
                        sum += (j+1) * (arr[j] + arr[len-j-1]);
                    }else{
                        sum += temp * (arr[j] + arr[len-j-1]);
                    }
                }
            }
        }
    }
    return sum;
};


console.log(sumOddLengthSubarrays([1, 1, 1, 1, 1]));