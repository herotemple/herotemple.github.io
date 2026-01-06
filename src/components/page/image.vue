<template>
  <div class="image-manager">
    <!-- 顶部操作栏 -->
    <div class="header-bar">
      <h2>分类钻孔图像管理</h2>
      <div class="tools">
        <el-select v-model="selectedCategory" placeholder="选择分类" clearable @change="filterImages">
          <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
        </el-select>
        <el-input v-model="search" placeholder="搜索图像名称" clearable @input="filterImages" />
        <el-upload
          class="upload-btn"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-change="handleFileChange"
          :auto-upload="false"
        >
          <el-button type="primary" icon="el-icon-upload">上传图片</el-button>
        </el-upload>
        <el-button
          type="primary"
          :disabled="!selectedFile"
          @click="submitUpload"
          style="margin-left: 8px;"
        >
          确认上传
        </el-button>
      </div>
    </div>

    <!-- 图像展示 -->
    <div class="image-gallery">
      <div class="image-card" v-for="img in pagedImages" :key="img.id">
        <el-image
          :src="getImageUrl(img.url)"
          fit="cover"
          class="image-thumb"
          @click="previewImage(img)"
        />
        <div class="card-footer">
          <div class="img-name">{{ img.name }}</div>
          <div class="img-actions">
            <el-button type="primary" size="small" @click="previewImage(img)">查看</el-button>
            <el-button type="text" icon="el-icon-delete" @click="deleteImage(img.id)" />
          </div>
        </div>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="filteredImages.length"
        :page-size="pageSize"
        :current-page="pageNum"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 预览弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="60%"
      top="15vh"
    >
    <div class="preview-container">
        <img :src="previewImageData.url" class="preview-img" />
        <div class="preview-info">
          <p><strong>名称：</strong>{{ previewImageData.name }}</p>
          <p><strong>分类：</strong>{{ previewImageData.category }}</p>
          <p><strong>上传时间：</strong>{{ previewImageData.uploadTime }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ImageManagerWithCategory",
  data() {
    return {
      imageList: [],
      filteredImages: [],
      pageSize: 8,
      pageNum: 1,
      search: "",
      selectedCategory: "全部",
      categories: ["全部"],
      dialogVisible: false,
      previewImageData: {},
      selectedFile: null,  // 选中的文件对象
    };
  },
  computed: {
    pagedImages() {
      const start = (this.pageNum - 1) * this.pageSize;
      return this.filteredImages.slice(start, start + this.pageSize);
    },
  },
  mounted() {
    this.fetchImages();
  },
  methods: {
    fetchImages() {
      this.$http.get("/api/images/list").then((res) => {
        const data = res.data || [];

        const categorySet = new Set(data.map((img) => img.category));
        this.categories = ["全部", ...Array.from(categorySet)];

        this.imageList = data.map((img) => ({
          ...img,
          uploadTime: img.uploadTime || new Date().toLocaleString(),
        }));

        this.filterImages();
      });
    },
    filterImages() {
      let result = this.imageList;

      if (this.search) {
        result = result.filter((img) => img.name.includes(this.search));
      }

      if (this.selectedCategory && this.selectedCategory !== "全部") {
        result = result.filter((img) => img.category === this.selectedCategory);
      }

      this.filteredImages = result;
      this.pageNum = 1;
    },
    handlePageChange(page) {
      this.pageNum = page;
    },
    getImageUrl(url) {
      return "http://localhost:8080" + url;
    },
    previewImage(img) {
      this.previewImageData = {
        ...img,
        url: this.getImageUrl(img.url),
      };
      this.dialogVisible = true;
    },
    deleteImage(id) {
      this.$confirm("确定删除该图像？", "提示", { type: "warning" }).then(() => {
        this.$http.delete(`/api/images/${id}`).then(() => {
          this.$message.success("删除成功");
          this.fetchImages();
        });
      });
    },

    // 上传前检查，阻止自动上传
    beforeUpload(file) {
      this.selectedFile = file;
      return false; // 阻止自动上传
    },
    handleFileChange(file) {
      this.selectedFile = file.raw || file;
    },

    // 确认上传按钮触发，先上传文件，再上传图片信息
    async submitUpload() {
      if (!this.selectedFile) {
        this.$message.warning("请先选择图片文件");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", this.selectedFile);
        formData.append("category", this.selectedCategory === "全部" ? "默认分类" : this.selectedCategory);

        await this.$http.post("/api/images/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        this.$message.success("上传成功");
        this.selectedFile = null;
        this.fetchImages();
      } catch (error) {
        console.error(error);
        this.$message.error("上传失败");
      }
    }

  },
};
</script>

<style scoped>
.image-manager {
  padding: 40px;
  background: #f5f8fc;
  min-height: 100vh;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-bar h2 {
  font-size: 24px;
  font-weight: bold;
}

.tools {
  display: flex;
  gap: 12px;
  align-items: center;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
}

.image-card {
  width: calc((100% - 60px) / 4);
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.image-card:hover {
  transform: scale(1.03);
}

.image-thumb {
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
}

.card-footer {
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.img-name {
  font-size: 14px;
  font-weight: 500;
}

.preview-container {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.preview-img {
  width: 60%;
  border-radius: 12px;
  object-fit: contain;
}

.preview-info {
  flex: 1;
  font-size: 16px;
  line-height: 1.8;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

</style>
