export default {
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            { title: 'Product Name', key: 'name' },
            { title: 'Price', key: 'price' },
            { title: 'Stock', key: 'quantity' },
            { title: 'Category', key: 'category' },
            { title: 'Actions', key: 'actions', sortable: false },
        ],
        products: [],
        categories: [],
        editedIndex: -1,
        editedItem: {
            name: '',
            price: '',
            quantity: '',
            category: '',
        },
        defaultItem: {
            name: '',
            price: '',
            quantity: '',
            category: '',
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

      async saveProduct() {
        if (this.editedIndex > -1) {
          await this.updateProduct();
        } else {
          await this.createProduct();
        }
      },

    async getProduct() {
      try {
          const token = localStorage.getItem('token');
          const productRequestOptions = {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: token,
              },
          };
          const categoryRequestOptions = {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: token,
              },
          };
  
          const [productResponse, categoryResponse] = await Promise.all([
              fetch(`${import.meta.env.VITE_API_BASE_URL}/product`, productRequestOptions),
              fetch(`${import.meta.env.VITE_API_BASE_URL}/category`, categoryRequestOptions),
          ]);
  
          if (!productResponse.ok || !categoryResponse.ok) {
              throw new Error('Something went wrong');
          }
  
          const productData = await productResponse.json();
          const categoryData = await categoryResponse.json();
  
          if (Array.isArray(productData) && Array.isArray(categoryData)) {
              this.products = productData.map(product => ({
                  ...product,
                  category: product.category ? product.category.cat_name : null,
              }));
  
              this.categories = categoryData.map(category => category.cat_name);
              console.log("Fetched categories:", this.categories);
              console.log(this.products.length, 'products');
              console.log(this.categories.length, 'categories');
          } else {
              console.error('Invalid data from the server', productData, categoryData);
          }
      } catch (error) {
          console.log('There is a fetching error of products or categories', error);
      }
  },
  
    
  async createProduct() {
    try {

        const category = await this.findCategoryByNameAsync(this.editedItem.category);

        if (!category) {
            console.error("Category not found");
            return;
        }

        console.log("Creating product with category:", category);

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
                cat_name: this.editedItem.category,
            }),
        };

        console.log("Request payload:", requestOptions.body);

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/product`, requestOptions);

console.log("Server response:", response.status, response.statusText);

if (response.status === 201) {
    console.log('Product created successfully!');
    this.getProduct();
    this.close();
    return response.json();
} else {
    const errorResponse = await response.json();
    console.error('Failed to create product. Status:', response.status);
    console.error('Server error response:', errorResponse);
    throw new Error('Failed to create product.');
}
    } catch (error) {
        console.error('Error creating product:', error);
    }
}
,

async findCategoryByNameAsync(categoryName) {
  try {
      const trimmedLowerCaseName = categoryName ? categoryName.trim().toLowerCase() : '';

      const token = localStorage.getItem('token');
      const requestOptions = {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              Authorization: token,
          },
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category`, requestOptions);
      const categoryData = await response.json();

      if (Array.isArray(categoryData)) {
          const foundCategory = categoryData.find(category =>
              category.cat_name.trim().toLowerCase() === trimmedLowerCaseName
          );

          if (foundCategory) {
              console.log('Found category:', foundCategory);
              return foundCategory;
          } else {
              console.error('Category not found. Trimmed and lowercased search:', trimmedLowerCaseName);
              return null;
          }
      } else {
          console.error('Invalid data for categories from the server', categoryData);
          return null;
      }
  } catch (error) {
      console.log('Error fetching categories:', error);
      return null;
  }
}

,
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
        category: this.findCategoryByNameAsync(this.editedItem.category)._id, 
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