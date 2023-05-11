const dfd = require('danfojs')

// 'C:/Users/senacrs/Desktop/biblio_api/Scripts/dados/books.csv'

data_path = 'C:/Users/senacrs/Desktop/biblio_api/Scripts/dados/books.csv' 

dfd.readCSV(data_path)
  .then(df => {

   //do something with the CSV file
   df.head().print()

  }).catch(err=>{
     console.log(err);
  })


