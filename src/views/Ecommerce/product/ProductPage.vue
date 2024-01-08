<template>
    <v-data-table :headers="headers" :items="products"  class="bg-lightprimary">
        <template v-slot:top>
            <v-toolbar flat class="bg-lightprimary">
                <v-toolbar-title >My PRODUCT</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ props }">
                        <v-btn color="primary"  dark class="mb-2" v-bind="props" >
                            New Item
                        </v-btn>
                        
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model=" editedItem.name" label="Product Name"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model=" editedItem.price" label="Price"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model=" editedItem.quantity" label="Stock"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" variant="text" @click="close">
                                Cancel
                            </v-btn>
                            <v-btn color="success" @click="saveProduct" variant="text" >
                                Save
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" variant="text" @click="closeDelete">Cancel</v-btn>
                            <v-btn color="lightindigo" variant="text" @click="deleteProduct">OK</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-icon size="small" class="me-2" @click="editItem(item)" color="primary">
                mdi-pencil
            </v-icon>
            <v-icon size="small" @click="deleteItem(item)" color="lightindigo">
                mdi-delete
            </v-icon>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="getProduct">
                Reset
            </v-btn>
        </template>
    </v-data-table>
</template>
<script>
import ProductTableScript from '@/services/ProductTableScript.js'
export default {
  mixins: [ProductTableScript],
}
</script>