<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
  import subject from '@/api/teacher/subject'
  export default {

    data() {
      return {
        filterText: '',
        data2: [],
        defaultProps: {
          children: 'children',
          label: 'title'
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val)
      }
    },

    methods: {
      //value是输入框里面输入要搜索的值   data是一个一级节点   会对所有的节点都调用这个方法
      filterNode(value, data) {
        if (!value) return true
        return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },
      getList(){
        subject.getSubjectList().then(response=>{
          console.log(response)
          this.data2=response.data.list;
        })
      }
    },
    created(){
    this.getList();
    }
  }
</script>

