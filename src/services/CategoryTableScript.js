export default {
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            { title: 'Category Name', key: 'cat_name' },
         
            { title: 'Actions', key: 'actions', sortable: false },
        ],
        categories: [],
        editedIndex: -1,
        editedItem: {
            cat_name: ''
           
        },
        defaultItem: {
            cat_name: ''
           
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
        this.getcategory()
    },

    methods: {

    savecategory() {
        if (this.editedIndex > -1) {
          this.updatecategory();
        } else {
          this.createcategory();
        }
    },

       async getcategory(){
            try {
                const token = localStorage.getItem('token')
                const requestOptions = {
                    method:'GET',
                    headers:{
                    'Content-Type':"application/json",
                    Authorization :token,
                    }
                };
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category`,requestOptions);
                if (!response.ok){
                    throw new Error('Something went wrong');
                }
                const data = await response.json();
                console.log(data);
                if (Array.isArray(data)){
                    this.categories = data;
                    console.log(this.categories.length , 'categories');
                }
                else{
                    console.error('invalid data from the server' , data)
                }
            } catch (error) {
                console.log(error ,  'there is fetching error of categories');
            }
  
        },
 createcategory() {
  const token = localStorage.getItem("token");
  
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      cat_name: this.editedItem.category,
   
    }),
  };

  fetch(`${import.meta.env.VITE_API_BASE_URL}/category`, requestOptions)
    .then((response) => {
      if (response.status === 201) {
        console.log('category created successfully!');
        this.getcategory();  
        this.close();  
        return response.json();
      } else {
        console.error('Failed to create category. Status:', response.status);
        throw new Error('Failed to create category.');
      }
    })
    .catch((error) => {
      console.error('Error creating category:', error);
    });
},



async updatecategory() {
  const token = localStorage.getItem('token');
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      cat_name: this.editedItem.category,
    }),
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category/${this.editedItem._id}`, requestOptions);

    if (!response.ok) {
      throw new Error('Failed to update category. Status:', response.status);
    }

    console.log('category updated successfully!');
    this.getcategory(); 
    this.close();  
  } catch (error) {
    console.error('Error updating category:', error);
  }
},


async deletecategory() {
    const token = localStorage.getItem('token');
    const requestOptions = {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        },
    };
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category/${this.editedItem._id}`, requestOptions);
    
        if (!response.ok) {
        throw new Error('Failed to delete category. Status:', response.status);
        }
    
        console.log('category deleted successfully!');
        this.getcategory(); 
        this.closeDelete();  
    } catch (error) {
        console.error('Error deleting category:', error);
    }
    },

  async editItem(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },
        deleteItem(item) {
            this.editedIndex = this.categories.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.categories.splice(this.editedIndex, 1)
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
                Object.assign(this.categories[this.editedIndex], this.editedItem)
            } else {
                this.categories.push(this.editedItem)
            }
            this.close()
        },
    },
}