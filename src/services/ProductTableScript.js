export default {
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            { title: 'Product Name', key: 'name' },
            { title: 'Price', key: 'price' },
            { title: 'Stock', key: 'quantity' },
            { title: 'Actions', key: 'actions', sortable: false },
        ],
        products: [],
        editedIndex: -1,
        editedItem: {
            name: '',
            price: '',
            quantity: '',
        },
        defaultItem: {
            name: '',
            price: '',
            quantity: '',
        },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {
        this.getProduct()
    },

    methods: {

    saveProduct() {
        if (this.editedIndex > -1) {
          this.updateProduct();
        } else {
          this.createProduct();
        }
    },

       async getProduct(){
            try {
                const token = localStorage.getItem('token')
                const requestOptions = {
                    method:'GET',
                    headers:{
                    'Content-Type':"application/json",
                    Authorization :token,
                    }
                };
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/product`,requestOptions);
                if (!response.ok){
                    throw new Error('Something went wrong');
                }
                const data = await response.json();
                console.log(data);
                if (Array.isArray(data)){
                    this.products = data;
                    console.log(this.products.length , 'products');
                }
                else{
                    console.error('invalid data from the server' , data)
                }
            } catch (error) {
                console.log(error ,  'there is fetching error of products');
            }
  
        },
 createProduct() {
  const token = localStorage.getItem("token");
  
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      name: this.editedItem.name,
      price: this.editedItem.price,
      quantity: this.editedItem.quantity,
    }),
  };

  fetch(`${import.meta.env.VITE_API_BASE_URL}/product`, requestOptions)
    .then((response) => {
      if (response.status === 201) {
        console.log('Product created successfully!');
        this.getProduct();  
        this.close();  
        return response.json();
      } else {
        console.error('Failed to create product. Status:', response.status);
        throw new Error('Failed to create product.');
      }
    })
    .catch((error) => {
      console.error('Error creating product:', error);
    });
},



async updateProduct() {
  const token = localStorage.getItem('token');
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      name: this.editedItem.name,
      price: this.editedItem.price,
      quantity: this.editedItem.quantity,
    }),
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/product/${this.editedItem._id}`, requestOptions);

    if (!response.ok) {
      throw new Error('Failed to update product. Status:', response.status);
    }

    console.log('Product updated successfully!');
    this.getProduct(); 
    this.close();  
  } catch (error) {
    console.error('Error updating product:', error);
  }
},


async deleteProduct() {
    const token = localStorage.getItem('token');
    const requestOptions = {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        },
    };
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/product/${this.editedItem._id}`, requestOptions);
    
        if (!response.ok) {
        throw new Error('Failed to delete product. Status:', response.status);
        }
    
        console.log('Product deleted successfully!');
        this.getProduct(); 
        this.closeDelete();  
    } catch (error) {
        console.error('Error deleting product:', error);
    }
    },

  async editItem(item) {
      this.editedIndex = this.products.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },
        deleteItem(item) {
            this.editedIndex = this.products.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.products.splice(this.editedIndex, 1)
            this.closeDelete()
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.products[this.editedIndex], this.editedItem)
            } else {
                this.products.push(this.editedItem)
            }
            this.close()
        },
    },
}