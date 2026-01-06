<template>
  <el-container class="portfolio-container" :class="{ 'dark-mode': isDarkMode }">
    <!-- 头部导航栏 -->
    <el-header class="header">
      <el-row type="flex" align="middle">
        <el-col :span="4">
          <div class="logo" @click="scrollToTop">
            <span class="logo-icon">🪨</span>
            <span class="logo-text">个人空间</span>
          </div>
        </el-col>
        <el-col :span="14" class="nav-center">
          <el-menu
            :default-active="activeNav"
            class="nav-menu"
            mode="horizontal"
            :background-color="isDarkMode ? 'transparent' : 'transparent'"
            :text-color="isDarkMode ? '#e8dfd2' : '#4a3b2c'"
            :active-text-color="isDarkMode ? '#ffd700' : '#a0522d'"
            @select="handleNavSelect"
          >
            <el-menu-item index="home">
              <i class="el-icon-house"></i>首页
            </el-menu-item>
            <el-menu-item index="core3d">
              <i class="el-icon-view"></i>岩芯3D
            </el-menu-item>
            <el-menu-item index="projects">
              <i class="el-icon-box"></i>我的项目
            </el-menu-item>
            <el-menu-item index="skills">
              <i class="el-icon-cpu"></i>技能图谱
            </el-menu-item>
            <el-menu-item index="awards">
              <i class="el-icon-trophy"></i>荣誉奖项
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="6" class="header-right">
          <el-tooltip content="切换主题" placement="bottom">
            <el-button
              class="btn-theme"
              :icon="isDarkMode ? 'el-icon-sunny' : 'el-icon-moon'"
              circle
              @click="toggleTheme"
            ></el-button>
          </el-tooltip>
          <el-tooltip :content="layoutMode === 'grid' ? '切换到列表视图' : '切换到网格视图'" placement="bottom">
            <el-button
              class="btn-mode"
              :icon="layoutMode === 'grid' ? 'el-icon-menu' : 'el-icon-grid'"
              @click="toggleLayoutMode"
            ></el-button>
          </el-tooltip>
          <el-button
            class="btn-contact"
            type="primary"
            icon="el-icon-message"
            @click="handleContact"
          >联系我</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main class="main-content">
      <!-- 个人简介横幅 -->
      <section class="hero-banner" id="home">
        <el-row type="flex" align="middle" :gutter="40">
          <el-col :span="8">
            <div class="avatar-section">
              <div class="avatar-wrapper">
                <div class="avatar">
                  <i class="el-icon-user-solid"></i>
                </div>
                <div class="avatar-badge">
                  <el-tag type="success" size="mini">在线</el-tag>
                </div>
              </div>
              <h2 class="user-name">李皓东</h2>
              <p class="user-title">数字媒体技术 · 全栈开发者</p>
              <div class="user-stats">
                <div class="stat">
                  <span class="stat-value">3/203</span>
                  <span class="stat-label">专业排名</span>
                </div>
                <div class="stat">
                  <span class="stat-value">3.68</span>
                  <span class="stat-label">GPA</span>
                </div>
                <div class="stat">
                  <span class="stat-value">20+</span>
                  <span class="stat-label">奖项</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="hero-content">
              <h1 class="hero-title">
                "身心<span class="highlight">必须有</span>一个<span class="highlight">走在</span>路上"
              </h1>
              <p class="hero-description">
                成都理工大学数字媒体技术专业学生，专注于计算机技术与电子信息技术的创新应用。
                在省级科研项目中负责核心开发，并获得多项国家级竞赛荣誉。
                擅长前后端分离开发，具备全栈工程实践能力。目前成功获得推免资格。
              </p>
              <div class="hero-actions">
                <el-button
                  type="primary"
                  icon="el-icon-download"
                  @click="downloadResume"
                >下载简历</el-button>
              </div>
              <div class="contact-bar">
                <span class="contact-item">
                  <i class="el-icon-phone"></i> 15984154851
                </span>
                <span class="contact-item">
                  <i class="el-icon-message"></i> 2322961236@qq.com
                </span>
                <span class="contact-item">
                  <i class="el-icon-location"></i> 四川省自贡市
                </span>
              </div>
            </div>
          </el-col>
        </el-row>
      </section>

      <!-- 核心功能区 -->
      <section class="core-features">
        <el-row :gutter="20">
          <!-- 3D岩芯展示 -->
          <el-col :span="12">
            <el-card class="feature-card" id="core3d">
              <div slot="header" class="card-header-with-actions">
                <div class="card-title">
                  <i class="el-icon-view card-icon"></i>
                  <span>岩芯3D可视化</span>
                  <el-tag type="danger" size="mini">科研项目展示</el-tag>
                </div>
                <div class="card-actions">
                  <el-button-group size="mini">
                    <el-button
                      v-for="view in views"
                      :key="view.id"
                      :type="activeView === view.id ? 'primary' : 'default'"
                      @click="changeView(view.id)"
                    >
                      {{ view.name }}
                    </el-button>
                  </el-button-group>
                </div>
              </div>

              <div class="core3d-container">
                <div class="core3d-visualization" :class="activeView">
                  <div class="core-model">
                    <div class="stratum stratum-1"></div>
                    <div class="stratum stratum-2"></div>
                    <div class="stratum stratum-3"></div>
                    <div class="stratum stratum-4"></div>

                    <div
                      v-for="point in dataPoints"
                      :key="point.id"
                      class="data-marker"
                      :style="{
                        left: point.x + '%',
                        top: point.y + '%',
                        'background-color': point.color
                      }"
                      @click="showDataDetail(point)"
                    >
                      <div class="marker-pulse"></div>
                      <div class="marker-tooltip" v-if="activeMarker === point.id">
                        <strong>{{ point.label }}</strong><br>
                        含量: {{ point.value }}<br>
                        深度: {{ point.depth }}m
                      </div>
                    </div>
                  </div>
                </div>

                <div class="core3d-controls">
                  <div class="control-group">
                    <label>旋转速度</label>
                    <el-slider
                      v-model="rotationSpeed"
                      :min="0"
                      :max="5"
                      :step="0.5"
                      show-stops
                      @change="updateRotation"
                    ></el-slider>
                  </div>

                  <div class="control-group">
                    <label>图层透明度</label>
                    <el-slider
                      v-model="layerOpacity"
                      :min="30"
                      :max="100"
                      :step="10"
                      show-stops
                    ></el-slider>
                  </div>

                  <div class="data-summary">
                    <h4>数据摘要</h4>
                    <p>岩芯样本总数: <strong>128</strong> 个</p>
                    <p>图像处理准确率: <strong>94.7%</strong></p>
                    <p>平均分类时间: <strong>0.8</strong> 秒/样本</p>
                  </div>
                </div>
              </div>

              <div class="card-footer">
                <el-button
                  type="text"
                  icon="el-icon-info"
                  @click="showCoreProjectDetail"
                >查看项目详情</el-button>
              </div>
            </el-card>
          </el-col>

          <!-- 技能图谱 -->
          <el-col :span="12">
            <el-card class="feature-card" id="skills">
              <div slot="header" class="card-header-with-actions">
                <div class="card-title">
                  <i class="el-icon-cpu card-icon"></i>
                  <span>技能图谱</span>
                  <el-tag type="success" size="mini">技术栈评估</el-tag>
                </div>
                <div class="card-actions">
                  <el-radio-group v-model="skillFilter" size="mini">
                    <el-radio-button label="all">全部</el-radio-button>
                    <el-radio-button label="frontend">前端</el-radio-button>
                    <el-radio-button label="backend">后端</el-radio-button>
                  </el-radio-group>
                </div>
              </div>

              <div class="skills-container">
                <div class="skills-visualization">
                  <div class="skill-category" v-for="category in filteredSkills" :key="category.name">
                    <h4>{{ category.name }}</h4>
                    <div class="skill-items">
                      <div
                        v-for="skill in category.skills"
                        :key="skill.name"
                        class="skill-item"
                        @mouseenter="highlightSkill(skill)"
                        @mouseleave="unhighlightSkill"
                      >
                        <div class="skill-info">
                          <span class="skill-name">{{ skill.name }}</span>
                          <span class="skill-level">{{ skill.level }}/10</span>
                        </div>
                        <el-progress
                          :percentage="skill.level * 10"
                          :show-text="false"
                          :color="getSkillColor(skill.level)"
                          :stroke-width="8"
                        ></el-progress>
                        <div class="skill-projects">
                          <el-tag
                            v-for="project in skill.projects"
                            :key="project"
                            size="mini"
                            type="info"
                          >{{ project }}</el-tag>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="skills-details" v-if="selectedSkill">
                  <div class="skill-detail-card">
                    <h4>{{ selectedSkill.name }}</h4>
                    <p class="skill-description">{{ selectedSkill.description }}</p>

                    <div class="skill-metrics">
                      <div class="metric">
                        <span class="metric-label">熟练度</span>
                        <el-rate
                          v-model="selectedSkill.level"
                          disabled
                          show-score
                          text-color="#ff9900"
                        ></el-rate>
                      </div>

                      <div class="metric">
                        <span class="metric-label">使用经验</span>
                        <span class="metric-value">{{ selectedSkill.experience }}</span>
                      </div>

                      <div class="metric">
                        <span class="metric-label">最后使用</span>
                        <span class="metric-value">{{ selectedSkill.lastUsed }}</span>
                      </div>
                    </div>

                    <div class="skill-actions">
                      <el-button
                        size="small"
                        icon="el-icon-document"
                        @click="showSkillProjects(selectedSkill)"
                      >相关项目</el-button>
                      <el-button
                        size="small"
                        icon="el-icon-collection"
                        @click="showSkillCertificates(selectedSkill)"
                      >相关证书</el-button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-footer">
                <el-button
                  type="text"
                  icon="el-icon-download"
                  @click="exportSkills"
                >导出技能报告</el-button>
                <el-button
                  type="text"
                  icon="el-icon-refresh"
                  @click="refreshSkills"
                >重新评估</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </section>

      <!-- 项目与奖项 -->
      <section class="projects-awards">
        <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
          <el-tab-pane label="我的项目" name="projects">
            <div class="projects-grid" :class="layoutMode">
              <el-card
                v-for="project in projects"
                :key="project.id"
                class="project-card"
                shadow="hover"
              >
                <div slot="header" class="project-header">
                  <div class="project-title">
                    <i :class="project.icon"></i>
                    <span>{{ project.title }}</span>
                  </div>
                  <el-tag :type="project.statusType" size="mini">{{ project.status }}</el-tag>
                </div>

                <div class="project-content">
                  <p class="project-description">{{ project.description }}</p>

                  <div class="project-tech">
                    <span class="tech-label">技术栈:</span>
                    <div class="tech-tags">
                      <el-tag
                        v-for="tech in project.technologies"
                        :key="tech"
                        size="mini"
                        class="tech-tag"
                      >{{ tech }}</el-tag>
                    </div>
                  </div>

                  <div class="project-metrics">
                    <div class="metric">
                      <i class="el-icon-time"></i>
                      <span>{{ project.duration }}</span>
                    </div>
                    <div class="metric">
                      <i class="el-icon-user"></i>
                      <span>{{ project.teamSize }}人</span>
                    </div>
                    <div class="metric">
                      <i class="el-icon-data-line"></i>
                      <span>{{ project.progress }}%</span>
                    </div>
                  </div>
                </div>

                <div class="project-actions">
                  <el-button
                    size="small"
                    icon="el-icon-view"
                    @click="showProjectDetailDialog(project)"
                  >详情</el-button>
                </div>
              </el-card>
            </div>
          </el-tab-pane>

          <el-tab-pane label="荣誉奖项" name="awards" id="awards">
            <div class="awards-timeline">
              <el-timeline>
                <el-timeline-item
                  v-for="award in awards"
                  :key="award.id"
                  :timestamp="award.date"
                  :type="award.type"
                  :icon="award.icon"
                  :color="award.color"
                  placement="top"
                >
                  <el-card
                    class="award-card"
                    :class="award.level"
                    shadow="hover"
                    @click.native="showAwardDetail(award)"
                  >
                    <div class="award-header">
                      <div class="award-icon">{{ award.medal }}</div>
                      <div class="award-info">
                        <h4>{{ award.title }}</h4>
                        <p class="award-organization">{{ award.organization }}</p>
                      </div>
                      <el-tag :type="award.tagType" class="award-level">{{ award.levelText }}</el-tag>
                    </div>

                    <div class="award-content">
                      <p>{{ award.description }}</p>
                      <div class="award-skills">
                        <el-tag
                          v-for="skill in award.skills"
                          :key="skill"
                          size="mini"
                          type="info"
                        >{{ skill }}</el-tag>
                      </div>
                    </div>

                    <div class="award-actions">

                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-tab-pane>
        </el-tabs>
      </section>

      <!-- 底部联系栏 -->
      <section class="contact-section">
        <el-card class="contact-card">
          <el-row type="flex" align="middle" :gutter="40">
            <el-col :span="16">
              <h3>立即开启合作</h3>
              <p>我正在寻找实习、项目合作和科研机会。如果您对我的技能和经验感兴趣，欢迎联系我！</p>

              <div class="contact-methods">
                <el-button
                  class="contact-method"
                  icon="el-icon-message"
                  @click="sendEmail"
                >
                  发送邮件
                </el-button>
                <el-button
                  class="contact-method"
                  icon="el-icon-phone"
                  @click="makePhoneCall"
                >
                  拨打电话
                </el-button>
                <el-button
                  class="contact-method"
                  icon="el-icon-chat-dot-round"
                  @click="openWeChat"
                >
                  微信联系
                </el-button>
                <el-button
                  class="contact-method"
                  icon="el-icon-video-camera"
                  @click="scheduleMeeting"
                >
                  预约会议
                </el-button>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="qr-code-section">
                <div class="qr-code-placeholder">
                  <i class="el-icon-chat-line-square"></i>
                  <p>微信扫码联系</p>
                </div>
                <p class="qr-tip">扫描二维码添加微信好友</p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </section>
    </el-main>

    <!-- 页脚 -->
    <el-footer class="footer">
      <div class="footer-content">
        <div class="footer-links">
          <a href="javascript:void(0)" @click="scrollToTop">回到顶部</a>
          <a href="javascript:void(0)" @click="toggleTheme">主题切换</a>
          <a href="javascript:void(0)" @click="printResume">打印简历</a>
          <a href="javascript:void(0)" @click="showSourceCode">查看源码</a>
        </div>
        <p class="copyright">
          © 2024 李皓东 - 个人作品集 | 成都理工大学数字媒体技术
        </p>
        <p class="tech-stack">
          使用 Vue.js + Element Plus 构建 | 响应式设计 | 交互式展示
        </p>
      </div>
    </el-footer>

    <!-- 岩芯项目详情弹窗 -->
    <el-dialog
      title="岩芯数据仓库系统"
      :visible.sync="showCoreProjectDialog"
      width="700px"
    >
      <div class="core-project-detail">
        <div class="project-overview">
          <h3><i class="el-icon-info"></i> 项目详情</h3>
          <div class="overview-content">
            <p class="overview-text">
              我在项目中负责岩芯图像展开模块的开发。它的作用是把岩芯截面在图像里呈现出的环形区域，精确地展开成规则的矩形条带，方便后续的分类和地层划分。具体实现思路是先确定圆心位置和内外半径，锁定需要展开的环带区域，然后通过极坐标展开的方法：列方向对应半径，行方向对应角度，把环带逐点映射到矩形图像中。在功能实现上，这个模块支持批量导入图像，参数可视化和调节以及单张或全序列的导出，为后续的自动分类和地层划分提供了统一、可控的数据输入。
            </p>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showCoreProjectDialog = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 计算机博弈AI系统详情弹窗 -->
    <el-dialog
      title="计算机博弈AI系统"
      :visible.sync="showGameProjectDialog"
      width="700px"
    >
      <div class="core-project-detail">
        <div class="project-overview">
          <h3><i class="el-icon-info"></i> 项目详情</h3>
          <div class="overview-content">
            <p class="overview-text">
              在军棋 AI 项目中，我主要负责的是评估函数的设计与实现。评估函数实现用到的是启发式评估方法，核心是通过棋子权重体系和特殊功能修正，来综合给局面打分。它本身不是独立的算法，而是作为搜索算法的评分依据，从而指导 AI 判断哪一步更优。
            </p>
            <div class="project-badges">
              <el-tag type="danger" size="small">国家级竞赛</el-tag>
              <el-tag type="warning" size="small">全国一等奖</el-tag>
              <el-tag type="info" size="small">AI算法</el-tag>
            </div>
          </div>
        </div>

        <div class="project-tech">
          <h3><i class="el-icon-cpu"></i> 技术要点</h3>
          <div class="tech-points">
            <div class="tech-point">
              <i class="el-icon-check"></i>
              <span>使用启发式评估方法，基于棋子权重体系</span>
            </div>
            <div class="tech-point">
              <i class="el-icon-check"></i>
              <span>实现特殊功能修正机制，提高局面评分准确性</span>
            </div>
            <div class="tech-point">
              <i class="el-icon-check"></i>
              <span>与搜索算法结合，指导AI选择最优策略</span>
            </div>
            <div class="tech-point">
              <i class="el-icon-check"></i>
              <span>通过大量对局数据优化评估函数参数</span>
            </div>
          </div>
        </div>

        <div class="project-achievements">
          <h3><i class="el-icon-trophy"></i> 项目成果</h3>
          <div class="achievements-list">
            <div class="achievement-item">
              <i class="el-icon-medal"></i>
              <span>2025年中国大学生计算机博弈大赛军棋赛道全国一等奖（全国亚军）</span>
            </div>
            <div class="achievement-item">
              <i class="el-icon-medal"></i>
              <span>2024年中国大学生计算机博弈大赛点格棋赛道国家二等奖</span>
            </div>
            <div class="achievement-item">
              <i class="el-icon-data-analysis"></i>
              <span>算法对战胜率达到85%以上，在128支参赛队伍中排名第2</span>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showGameProjectDialog = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 个人作品集网站详情弹窗 -->
    <el-dialog
      title="个人作品集网站"
      :visible.sync="showPortfolioProjectDialog"
      width="700px"
    >
      <div class="core-project-detail">
        <div class="project-overview">
          <h3><i class="el-icon-info"></i> 项目详情</h3>
          <div class="overview-content">
            <p class="overview-text">
              在这个项目中，我采用 Spring Boot 作为后端框架，微信开发者工具作为前端开发环境，负责全栈开发工作，包括数据库设计、接口开发与联调、数据交互测试等。
            </p>
            <div class="project-badges">
              <el-tag type="success" size="small">全栈开发</el-tag>
              <el-tag type="primary" size="small">响应式设计</el-tag>
              <el-tag type="info" size="small">商用项目</el-tag>
            </div>
          </div>
        </div>

        <div class="project-tech">
          <h3><i class="el-icon-cpu"></i> 技术实现</h3>
          <div class="tech-details">
            <div class="tech-section">
              <h4>后端架构</h4>
              <p>①Spring Boot 开箱即用，支持 RESTful API，能高效完成前后端分离；</p>
            </div>

            <div class="tech-section">
              <h4>前端交互</h4>
              <p>②微信小程序则通过 wx.request() 与后端交互，获取 JSON 数据后更新页面。</p>
            </div>

            <div class="tech-section">
              <h4>数据库设计</h4>
              <p>③数据库方面，我使用 MySQL，设计了用户、商品、订单等表，并对高频字段建立索引，提高了查询效率。</p>
            </div>
          </div>
        </div>

        <div class="project-challenges">
          <h3><i class="el-icon-question"></i> 开发挑战与收获</h3>
          <div class="challenges-content">
            <p>
              开发过程中解决了跨域、数据同步、接口调试等问题，同时深刻体会到前期需求分析和逻辑梳理的重要性。最终小程序顺利通过微信审核，部署到云服务器，目前已在公司投入商用。
            </p>
          </div>
        </div>

        <div class="project-optimization">
          <h3><i class="el-icon-trend-charts"></i> 性能优化方案</h3>
          <div class="optimization-list">
            <div class="optimization-item">
              <i class="el-icon-loading"></i>
              <span>缓存优化：使用Redis缓存热点数据</span>
            </div>
            <div class="optimization-item">
              <i class="el-icon-search"></i>
              <span>索引优化：对高频查询字段建立复合索引</span>
            </div>
            <div class="optimization-item">
              <i class="el-icon-picture"></i>
              <span>懒加载：图片和资源按需加载</span>
            </div>
            <div class="optimization-item">
              <i class="el-icon-set-up"></i>
              <span>微服务架构：采用Spring Cloud实现服务拆分</span>
            </div>
            <div class="optimization-item">
              <i class="el-icon-s-operation"></i>
              <span>负载均衡：Nginx实现请求分发</span>
            </div>
          </div>
          <p class="optimization-summary">
            如果未来用户量增加，可以通过缓存、索引优化、懒加载以及微服务架构与负载均衡来提升系统性能和稳定性。
          </p>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showPortfolioProjectDialog = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 新增：证书查看弹窗 -->
    <el-dialog
      :title="selectedAward ? selectedAward.title + ' - 获奖证书' : '获奖证书'"
      :visible.sync="showCertificateDialog"
      width="800px"
      top="5vh"
      @close="handleCloseCertificate"
    >
      <div class="certificate-container">
        <!-- 证书图片展示 -->
        <div class="certificate-image-wrapper" v-if="selectedAward && selectedAward.certificate">
          <img
            :src="getCertificateUrl(selectedAward.certificate)"
            :alt="selectedAward.title + '证书'"
            class="certificate-image"
            @load="handleImageLoad"
            @error="handleImageError"
          />
          <div v-if="loadingCertificate" class="certificate-loading">
            <i class="el-icon-loading"></i>
            <p>正在加载证书...</p>
          </div>
        </div>

        <!-- 无证书时的提示 -->
        <div v-else-if="selectedAward" class="no-certificate">
          <i class="el-icon-picture-outline"></i>
          <h3>证书图片暂未上传</h3>
          <p>该奖项的证书图片正在整理中，敬请期待</p>
        </div>

        <!-- 证书信息 -->
        <div class="certificate-info" v-if="selectedAward">
          <el-descriptions
            :column="2"
            border
            size="small"
            class="certificate-details"
          >
            <el-descriptions-item label="获奖名称">
              {{ selectedAward.title }}
            </el-descriptions-item>
            <el-descriptions-item label="颁发机构">
              {{ selectedAward.organization }}
            </el-descriptions-item>
            <el-descriptions-item label="获奖时间">
              {{ selectedAward.date }}
            </el-descriptions-item>
            <el-descriptions-item label="奖项级别">
              <el-tag :type="selectedAward.tagType" size="small">
                {{ selectedAward.levelText }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="获奖描述" :span="2">
              {{ selectedAward.description }}
            </el-descriptions-item>
            <el-descriptions-item label="涉及技能" :span="2">
              <div class="skill-tags">
                <el-tag
                  v-for="skill in selectedAward.skills"
                  :key="skill"
                  size="mini"
                  type="info"
                  class="skill-tag"
                >{{ skill }}</el-tag>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="selectedAward && selectedAward.certificate"
          type="primary"
          icon="el-icon-download"
          @click="downloadCertificate"
        >
          下载证书
        </el-button>
        <el-button @click="showCertificateDialog = false">关闭</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: 'OptimizedPortfolio',
  data() {
    return {
      isDarkMode: false,
      layoutMode: 'grid',
      activeNav: 'home',
      activeTab: 'projects',
      activeView: 'top',
      skillFilter: 'all',

      // 项目详情弹窗控制
      showCoreProjectDialog: false,
      showGameProjectDialog: false,
      showPortfolioProjectDialog: false,

      // 新增：证书查看弹窗控制
      showCertificateDialog: false,
      selectedAward: null,
      loadingCertificate: false,

      // 3D展示数据
      rotationSpeed: 2,
      layerOpacity: 80,
      activeMarker: null,
      views: [
        { id: 'top', name: '顶视' },
        { id: 'side', name: '侧视' },
        { id: 'cross', name: '剖面' }
      ],
      dataPoints: [
        {
          id: 1,
          x: 30,
          y: 40,
          label: '石英',
          value: '85%',
          depth: '12.5m',
          color: '#ff6b6b'
        },
        {
          id: 2,
          x: 60,
          y: 25,
          label: '长石',
          value: '72%',
          depth: '8.3m',
          color: '#4ecdc4'
        },
        {
          id: 3,
          x: 45,
          y: 60,
          label: '云母',
          value: '63%',
          depth: '15.7m',
          color: '#45b7d1'
        }
      ],

      // 技能数据
      selectedSkill: null,
      skills: [
        {
          name: '前端开发',
          skills: [
            {
              name: 'Vue.js',
              level: 9,
              description: '熟练掌握Vue 3 Composition API和生态工具',
              experience: '2年项目经验',
              lastUsed: '2024.10',
              projects: ['岩芯数据仓库前端', '个人作品集'],
              type: 'frontend'
            },
            {
              name: 'JavaScript',
              level: 9,
              description: '精通ES6+特性，熟悉TypeScript',
              experience: '3年经验',
              lastUsed: '2024.10',
              projects: ['多个前端项目'],
              type: 'frontend'
            },
            {
              name: 'Element Plus',
              level: 8,
              description: '熟练使用Element Plus UI组件库',
              experience: '1.5年经验',
              lastUsed: '2024.10',
              projects: ['岩芯数据仓库', '作品集'],
              type: 'frontend'
            }
          ]
        },
        {
          name: '后端开发',
          skills: [
            {
              name: 'Spring Boot',
              level: 8,
              description: '掌握Spring Boot框架和RESTful API设计',
              experience: '1年项目经验',
              lastUsed: '2024.08',
              projects: ['岩芯数据仓库后端'],
              type: 'backend'
            },
            {
              name: 'Java',
              level: 8,
              description: '熟练掌握Java核心编程和Spring生态',
              experience: '2年经验',
              lastUsed: '2024.08',
              projects: ['岩芯项目后端'],
              type: 'backend'
            },
            {
              name: 'MySQL',
              level: 7,
              description: '掌握数据库设计和SQL优化',
              experience: '1年经验',
              lastUsed: '2024.08',
              projects: ['岩芯数据仓库'],
              type: 'backend'
            }
          ]
        },
        {
          name: '其他技能',
          skills: [
            {
              name: 'C++',
              level: 8,
              description: '熟悉Qt框架和图像处理编程',
              experience: '2年经验',
              lastUsed: '2024.06',
              projects: ['岩芯图像展开模块'],
              type: 'other'
            },
            {
              name: 'Git',
              level: 8,
              description: '熟练使用Git进行版本控制和团队协作',
              experience: '2年经验',
              lastUsed: '2024.10',
              projects: ['所有项目'],
              type: 'other'
            }
          ]
        }
      ],

      // 项目数据
      currentProject: null,
      showProjectDialog: false,
      projects: [
        {
          id: 1,
          title: '岩芯数据仓库系统',
          icon: 'el-icon-box',
          status: '已上线',
          statusType: 'success',
          description: '基于Hybrid Models的岩性分析及地质勘探应用系统，实现岩芯图像的采集、处理和可视化分析。',
          technologies: ['Vue.js', 'Spring Boot', 'MySQL', 'C++', 'Qt'],
          duration: '6个月',
          teamSize: 5,
          progress: 100,
          details: {
            role: '核心开发者',
            responsibilities: ['岩芯图像展开模块开发', 'Web数据仓库搭建', '前后端接口设计'],
            achievements: ['实用新型专利1项', '省级科研项目', '图像分类准确率94.7%']
          }
        },
        {
          id: 2,
          title: '计算机博弈AI系统',
          icon: 'el-icon-chess',
          status: '竞赛项目',
          statusType: 'warning',
          description: '基于人工智能算法的军棋博弈系统，获得全国大学生计算机博弈大赛一等奖。',
          technologies: ['Python', 'AI算法', '博弈论'],
          duration: '4个月',
          teamSize: 3,
          progress: 100,
          details: {
            role: '算法工程师',
            responsibilities: ['博弈树算法优化', '评估函数设计', '对战策略开发'],
            achievements: ['全国一等奖（亚军）', '国家二等奖']
          }
        },
        {
          id: 3,
          title: '个人作品集网站',
          icon: 'el-icon-monitor',
          status: '进行中',
          statusType: 'info',
          description: '响应式个人作品集网站，展示项目经验和技能，采用Vue.js和Element Plus构建。',
          technologies: ['Vue.js', 'Element Plus', 'JavaScript', 'CSS3'],
          duration: '2周',
          teamSize: 1,
          progress: 90,
          details: {
            role: '全栈开发者',
            responsibilities: ['UI/UX设计', '前端开发', '交互实现'],
            achievements: ['响应式设计', '交互式组件', '3D可视化']
          }
        }
      ],

      // 奖项数据 - 证书路径已修复
      awards: [
        {
          id: 1,
          date: '2025年6月',
          title: '中国大学生计算机博弈大赛',
          organization: '教育部高等学校计算机类专业教指委',
          description: '军棋赛道全国一等奖（全国亚军），在128支队伍中脱颖而出。',
          medal: '🥇',
          level: 'national',
          levelText: '国家级',
          tagType: 'danger',
          type: 'primary',
          icon: 'el-icon-trophy',
          color: '#e6a23c',
          skills: ['AI算法', '博弈论', 'Python', '团队协作'],
          // 使用相对路径，便于处理
          certificate: '博弈大赛（军棋）国一.jpg'
        },
        {
          id: 2,
          date: '2025年5月',
          title: '博弈创新设计大赛',
          organization: '人工智能学会',
          description: '基于深度学习的图像识别系统获得创新设计一等奖。',
          medal: '🏆',
          level: 'national',
          levelText: '国家级',
          tagType: 'danger',
          type: 'success',
          icon: 'el-icon-medal',
          color: '#67c23a',
          skills: ['深度学习', '图像处理', 'Python', '创新设计'],
          certificate: '博弈创新设计赛.png'
        },
        {
          id: 3,
          date: '2024年10月',
          title: '中国大学生计算机博弈大赛',
          organization: '教育部高等学校计算机类专业教指委',
          description: '点格棋赛道国家二等奖，展示优秀的算法设计和实现能力。',
          medal: '🥈',
          level: 'national',
          levelText: '国家级',
          tagType: 'danger',
          type: 'info',
          icon: 'el-icon-trophy',
          color: '#909399',
          skills: ['算法设计', '逻辑思维', 'Python'],
          certificate: '博弈大赛（点格棋）国二.jpg'
        },
        {
          id: 4,
          date: '2024年9月',
          title: '四川省大学生计算机设计大赛',
          organization: '四川省教育厅',
          description: '大数据应用赛道一等奖，设计并实现高效的数据分析系统。',
          medal: '🥇',
          level: 'provincial',
          levelText: '省级',
          tagType: 'warning',
          type: 'primary',
          icon: 'el-icon-trophy',
          color: '#e6a23c',
          skills: ['大数据', '数据分析', '系统设计', '团队协作'],
          certificate: '中国大学生计算机设计大赛（大数据应用）省二.jpg'
        },
        {
          id: 5,
          date: '2024年5月',
          title: '蓝桥杯全国软件大赛',
          organization: '工业和信息化部人才交流中心',
          description: 'C++程序设计省级二等奖，展示扎实的编程基础和问题解决能力。',
          medal: '🥈',
          level: 'provincial',
          levelText: '省级',
          tagType: 'warning',
          type: 'success',
          icon: 'el-icon-trophy',
          color: '#67c23a',
          skills: ['C++', '算法', '数据结构'],
          certificate: '蓝桥杯省二.jpg'
        },
        {
          id: 6,
          date: '2024年4月',
          title: "大唐杯全国大学生通信技术大赛",
          organization: '中国通信学会',
          description: '信息通信工程实践赛道省级二等奖，展示通信技术的实践能力。',
          medal: '🥉',
          level: 'provincial',
          levelText: '省级',
          tagType: 'warning',
          type: 'info',
          icon: 'el-icon-medal',
          color: '#909399',
          skills: ['通信技术', '工程实践', '团队合作'],
          certificate: '大唐杯省二.jpg'
        },
        {
          id: 7,
          date: '2023年12月',
          title: '中国好创意全国数字艺术设计大赛',
          organization: '全国数字艺术设计大赛组委会',
          description: '海报设计赛道省级二等奖，展示数字媒体设计能力。',
          medal: '🎨',
          level: 'provincial',
          levelText: '省级',
          tagType: 'warning',
          type: 'primary',
          icon: 'el-icon-picture',
          color: '#e6a23c',
          skills: ['数字媒体', '平面设计', '创意设计'],
          certificate: '中国好创意省二.png'
        }
      ],

      // 对话框控制
      showSkillDialog: false
    };
  },
  computed: {
    filteredSkills() {
      if (this.skillFilter === 'all') return this.skills;

      return this.skills.map(category => ({
        ...category,
        skills: category.skills.filter(skill =>
          this.skillFilter === 'frontend' ? skill.type === 'frontend' :
            this.skillFilter === 'backend' ? skill.type === 'backend' : true
        )
      })).filter(category => category.skills.length > 0);
    }
  },
  mounted() {
    this.initEventListeners();
    this.startAnimations();
  },
  methods: {
    // 新增：获取证书完整URL
    getCertificateUrl(filename) {
      // 开发环境使用public目录
      if (process.env.NODE_ENV === 'development') {
        return `/certificates/${encodeURIComponent(filename)}`;
      } else {
        // 生产环境使用绝对路径
        return `/certificates/${encodeURIComponent(filename)}`;
      }
    },

    // 新增：显示岩芯项目详情
    showCoreProjectDetail() {
      this.showCoreProjectDialog = true;
    },

    // 新增：显示项目详情弹窗
    showProjectDetailDialog(project) {
      if (project.id === 1) {
        this.showCoreProjectDialog = true;
      } else if (project.id === 2) {
        this.showGameProjectDialog = true;
      } else if (project.id === 3) {
        this.showPortfolioProjectDialog = true;
      }
    },

    // 主题与布局
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      const theme = this.isDarkMode ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      this.$message.success(`已切换到${this.isDarkMode ? '深色' : '浅色'}主题`);
    },

    toggleLayoutMode() {
      this.layoutMode = this.layoutMode === 'grid' ? 'list' : 'grid';
      this.$message.info(`切换到${this.layoutMode === 'grid' ? '网格' : '列表'}视图`);
    },

    // 导航与滚动
    handleNavSelect(key) {
      this.activeNav = key;
      this.scrollToSection(key);
    },

    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 70;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // 如果是标签页，切换到对应的标签
        if (sectionId === 'projects' || sectionId === 'awards') {
          this.activeTab = sectionId === 'projects' ? 'projects' : 'awards';
        }
      }
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      this.activeNav = 'home';
    },

    // 3D展示功能
    changeView(view) {
      this.activeView = view;
      this.$message.info(`切换到${view}视图`);
    },

    updateRotation() {
      // 这里可以添加旋转动画控制
      console.log('旋转速度更新为:', this.rotationSpeed);
    },

    showDataDetail(point) {
      this.activeMarker = point.id;
      this.$message({
        message: `${point.label}: 含量${point.value}, 深度${point.depth}`,
        type: 'info',
        duration: 2000
      });
    },

    // 原方法保持不变
    showProjectDetail(type) {
      const project = this.projects.find(p =>
        type === 'core' ? p.id === 1 : p.id === 2
      );
      if (project) {
        this.showProjectDetailDialog(project);
      }
    },

    showDemoVideo() {
      this.$message.info('演示视频功能开发中...');
      // 实际项目中这里可以打开视频模态框
    },

    // 技能相关功能
    getSkillColor(level) {
      if (level >= 9) return '#67c23a';
      if (level >= 7) return '#e6a23c';
      return '#f56c6c';
    },

    highlightSkill(skill) {
      this.selectedSkill = skill;
    },

    unhighlightSkill() {
      // 可以保留选中的技能，或者设置为null
      // this.selectedSkill = null;
    },

    exportSkills() {
      this.$message.success('技能报告已生成，开始下载...');
      // 实际项目中这里可以生成并下载PDF报告
    },

    refreshSkills() {
      this.$message.info('正在重新评估技能...');
      // 模拟重新评估
      setTimeout(() => {
        this.$message.success('技能评估已更新');
      }, 1000);
    },

    showSkillProjects(skill) {
      this.$message.info(`查看${skill.name}的相关项目`);
      // 可以打开项目过滤视图
    },

    showSkillCertificates(skill) {
      this.$message.info(`查看${skill.name}的相关证书`);
      // 可以打开证书展示
    },

    // 项目相关功能 - 修改为使用新方法
    openProjectDetail(project) {
      this.showProjectDetailDialog(project);
    },

    playProjectDemo(project) {
      this.$message.info(`开始播放${project.title}的演示视频`);
      // 实际项目中这里可以打开视频播放器
    },

    downloadProjectDocs(project) {
      this.$message.success(`开始下载${project.title}的项目文档`);
      // 实际项目中这里可以触发文件下载
    },

    // 奖项相关功能
    showAwardDetail(award) {
      this.$message({
        message: `${award.title} - ${award.description}`,
        type: 'info',
        duration: 3000
      });
    },

    // 新增：显示奖项证书（优化版）
    showAwardCertificate(award) {
      this.selectedAward = award;
      this.showCertificateDialog = true;
      this.loadingCertificate = true;

      // 记录查看行为（可选）
      console.log(`查看证书: ${award.title}`, this.getCertificateUrl(award.certificate));
    },

    // 新增：处理图片加载完成
    handleImageLoad() {
      this.loadingCertificate = false;
      console.log('证书图片加载成功');
    },

    // 新增：处理图片加载错误
    handleImageError(e) {
      this.loadingCertificate = false;
      console.error('证书图片加载失败:', e);
      this.$message.error('证书图片加载失败，请检查文件是否存在');
    },

    // 新增：关闭证书弹窗
    handleCloseCertificate() {
      this.selectedAward = null;
      this.loadingCertificate = false;
    },

    // 新增：下载证书（支持本地文件）
    downloadCertificate() {
      if (!this.selectedAward || !this.selectedAward.certificate) {
        this.$message.warning('无法下载证书：证书图片不存在');
        return;
      }

      const link = document.createElement('a');
      const certificateUrl = this.getCertificateUrl(this.selectedAward.certificate);
      link.href = certificateUrl;

      // 从路径中提取文件名
      let fileName = this.selectedAward.certificate;

      // 如果没有扩展名，添加.jpg
      if (!fileName.includes('.')) {
        fileName += '.jpg';
      }

      link.download = fileName;
      link.target = '_blank';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.$message.success('开始下载证书...');
    },

    shareAward(award) {
      this.$message.success(`已复制${award.title}的分享链接`);
      // 实际项目中这里可以复制分享链接到剪贴板
    },

    // 联系功能
    handleContact() {
      this.scrollToSection('home');
      this.$message.info('请使用下方的联系方式与我联系');
    },

    sendEmail() {
      const email = '2322961236@qq.com';
      const subject = '联系李皓东 - 来自作品集网站';
      const body = '您好，我在您的作品集网站上看到了您的信息，希望与您联系...';

      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    },

    makePhoneCall() {
      const phone = '15984154851';
      if (confirm(`是否要拨打 ${phone}？`)) {
        window.location.href = `tel:${phone}`;
      }
    },

    openWeChat() {
      this.$message.info('微信二维码已显示在页面右侧');
      // 实际项目中这里可以显示微信二维码大图
    },

    scheduleMeeting() {
      this.$message.info('会议预约功能开发中...');
      // 实际项目中可以集成Calendly等预约工具
    },

    // 其他功能
    downloadResume() {
      // 创建下载链接
      const link = document.createElement('a');
      link.href = '/resume.pdf'; // PDF文件在public目录中
      link.download = '李皓东_个人简历.pdf'; // 下载的文件名

      // 添加链接到DOM并点击
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.$message.success('简历下载中...');
      // 实际项目中这里可以触发简历PDF下载
    },

    playIntroVideo() {
      this.$message.info('开始播放个人介绍视频...');
      // 实际项目中这里可以打开视频模态框
    },

    startChat() {
      this.$message.info('在线聊天功能开发中...');
      // 实际项目中可以集成在线聊天工具
    },

    printResume() {
      window.print();
    },

    showSourceCode() {
      this.$message.info('源代码已托管在GitHub: https://github.com/username/portfolio');
      // 实际项目中可以打开GitHub链接
    },

    handleTabClick(tab) {
      this.activeTab = tab.name;
      this.scrollToSection(tab.name);
    },

    handleCloseDialog(done) {
      this.$confirm('确定要关闭详情吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        done();
      }).catch(() => {
      });
    },

    // 初始化
    initEventListeners() {
      // 监听滚动更新激活的导航项
      window.addEventListener('scroll', this.handleScroll);
    },

    handleScroll() {
      // 可以添加滚动时更新导航激活状态的功能
      const sections = ['home', 'core3d', 'projects', 'skills', 'awards'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const {offsetTop, offsetHeight} = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            if (this.activeNav !== section) {
              this.activeNav = section;
            }
            break;
          }
        }
      }
    },

    startAnimations() {
      // 可以添加页面加载时的动画效果
      setTimeout(() => {
        document.querySelector('.hero-banner').classList.add('animated');
      }, 300);
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>

<style scoped>
/* 全局样式 */
:root {
  --primary-color: #4a3b2c;
  --secondary-color: #a0522d;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --info-color: #909399;
  --bg-color: #f7f5f2;
  --card-bg: #ffffff;
  --text-primary: #303133;
  --text-regular: #606266;
  --border-color: #ebeef5;
}

[data-theme="dark"] {
  --primary-color: #2c3e50;
  --secondary-color: #8b4513;
  --bg-color: #1a1a2e;
  --card-bg: #162447;
  --text-primary: #e0e0e0;
  --text-regular: #b0b0b0;
  --border-color: #2d3748;
}

.portfolio-container {
  min-height: 100vh;
  background-color: var(--bg-color);
  transition: background-color 0.3s ease;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

.dark-mode {
  background-color: var(--bg-color);
}

/* 头部导航 */
.header {
  background: var(--card-bg);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0 24px;
  height: 64px;
  transition: all 0.3s ease;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 10px 0;
}

.logo:hover {
  opacity: 0.8;
}

.logo-icon {
  font-size: 28px;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: var(--primary-color);
  letter-spacing: 0.5px;
}

.nav-center {
  display: flex;
  justify-content: center;
}

.nav-menu {
  border-bottom: none;
  background: transparent !important;
}

.nav-menu >>> .el-menu-item {
  font-weight: 500;
  transition: all 0.3s ease;
  margin: 0 8px;
  border-radius: 6px;
}

.nav-menu >>> .el-menu-item:hover {
  background-color: rgba(160, 82, 45, 0.1);
}

.nav-menu >>> .el-menu-item.is-active {
  background-color: rgba(160, 82, 45, 0.15);
  transform: translateY(-1px);
}

.header-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.btn-theme, .btn-mode {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.btn-theme:hover, .btn-mode:hover {
  background-color: rgba(160, 82, 45, 0.1);
  transform: translateY(-2px);
}

.btn-contact {
  background: linear-gradient(135deg, var(--secondary-color), #8b4513);
  color: white;
  border: none;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.btn-contact:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(160, 82, 45, 0.3);
}

/* 个人简介横幅 */
.hero-banner {
  background: linear-gradient(135deg, var(--card-bg) 0%, rgba(255, 255, 255, 0.95) 100%);
  border-radius: 20px;
  padding: 40px;
  margin: 24px 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.5s ease;
}

.dark-mode .hero-banner {
  background: linear-gradient(135deg, var(--card-bg) 0%, rgba(30, 30, 46, 0.95) 100%);
}

.hero-banner.animated {
  animation: fadeInUp 0.8s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.avatar-section {
  text-align: center;
  padding: 20px;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.avatar {
  width: 140px;
  height: 140px;
  background: linear-gradient(135deg, #f3ede6 0%, #e8dfd2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 5px solid white;
  box-shadow: 0 8px 25px rgba(74, 59, 44, 0.15);
}

.avatar i {
  font-size: 64px;
  color: var(--secondary-color);
}

.avatar-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.user-name {
  font-size: 32px;
  color: var(--text-primary);
  margin: 10px 0 5px;
}

.user-title {
  color: var(--text-regular);
  font-size: 16px;
  margin-bottom: 20px;
}

.user-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--secondary-color);
}

.stat-label {
  font-size: 14px;
  color: var(--text-regular);
  margin-top: 4px;
}

.hero-content {
  padding-right: 20px;
}

.hero-title {
  font-size: 36px;
  line-height: 1.3;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.highlight {
  color: var(--secondary-color);
  font-weight: bold;
  position: relative;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--secondary-color), transparent);
  border-radius: 2px;
}

.hero-description {
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-regular);
  margin-bottom: 30px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
}

.hero-actions >>> .el-button {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
}

.contact-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-regular);
  font-size: 14px;
}

.contact-item i {
  color: var(--secondary-color);
}

/* 核心功能区 */
.core-features {
  margin: 40px 0;
}

.feature-card {
  border-radius: 16px;
  border: 1px solid var(--border-color);
  height: 100%;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1) !important;
}

.card-header-with-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.card-icon {
  color: var(--secondary-color);
  font-size: 20px;
}

/* 3D展示器 */
.core3d-container {
  display: flex;
  gap: 30px;
  padding: 20px 0;
}

.core3d-visualization {
  flex: 1;
  min-height: 300px;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8f4e9 0%, #f1e8d8 100%);
}

.dark-mode .core3d-visualization {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
}

.core-model {
  width: 100%;
  height: 100%;
  position: relative;
}

.stratum {
  position: absolute;
  border-radius: 50%;
  opacity: v-bind('layerOpacity/100');
  transition: opacity 0.3s ease;
}

.stratum-1 {
  width: 200px;
  height: 200px;
  top: 50px;
  left: 50px;
  background: linear-gradient(45deg, #8b4513, #a0522d);
  animation: rotate 20s linear infinite;
}

.stratum-2 {
  width: 160px;
  height: 160px;
  top: 70px;
  left: 70px;
  background: linear-gradient(45deg, #d2691e, #cd853f);
  animation: rotate 18s linear infinite reverse;
}

.stratum-3 {
  width: 120px;
  height: 120px;
  top: 90px;
  left: 90px;
  background: linear-gradient(45deg, #f4a460, #deb887);
  animation: rotate 16s linear infinite;
}

.stratum-4 {
  width: 80px;
  height: 80px;
  top: 110px;
  left: 110px;
  background: linear-gradient(45deg, #ffdead, #f5deb3);
  animation: rotate 14s linear infinite reverse;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.data-marker {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.marker-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: inherit;
  opacity: 0.3;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

.marker-tooltip {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 100;
  pointer-events: none;
}

.core3d-controls {
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control-group {
  background: rgba(0, 0, 0, 0.02);
  padding: 15px;
  border-radius: 8px;
}

.dark-mode .control-group {
  background: rgba(255, 255, 255, 0.05);
}

.control-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-regular);
  font-size: 14px;
}

.data-summary {
  background: linear-gradient(135deg, rgba(160, 82, 45, 0.1) 0%, rgba(139, 69, 19, 0.05) 100%);
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid var(--secondary-color);
}

.data-summary h4 {
  margin: 0 0 10px 0;
  color: var(--text-primary);
}

.data-summary p {
  margin: 5px 0;
  color: var(--text-regular);
  font-size: 14px;
}

.card-footer {
  border-top: 1px solid var(--border-color);
  padding-top: 15px;
  display: flex;
  gap: 20px;
}

/* 技能展示 */
.skills-container {
  display: flex;
  gap: 30px;
  min-height: 400px;
}

.skills-visualization {
  flex: 2;
}

.skill-category {
  margin-bottom: 25px;
}

.skill-category h4 {
  color: var(--text-primary);
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 6px;
  border-bottom: 2px solid var(--border-color);
}

.skill-item {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.skill-item:hover {
  border-color: var(--secondary-color);
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.skill-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.skill-name {
  font-weight: 500;
  color: var(--text-primary);
}

.skill-level {
  color: var(--secondary-color);
  font-weight: bold;
}

.skill-projects {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.skills-details {
  flex: 1;
  min-width: 250px;
}

.skill-detail-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  position: sticky;
  top: 90px;
}

.skill-description {
  color: var(--text-regular);
  font-size: 14px;
  line-height: 1.5;
  margin: 15px 0;
}

.skill-metrics {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
}

.dark-mode .skill-metrics {
  background: rgba(255, 255, 255, 0.05);
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.metric:last-child {
  margin-bottom: 0;
}

.metric-label {
  color: var(--text-regular);
  font-size: 14px;
}

.metric-value {
  color: var(--text-primary);
  font-weight: 500;
}

.skill-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

/* 项目展示 */
.projects-awards {
  margin: 40px 0;
}

.projects-grid {
  display: grid;
  gap: 20px;
}

.projects-grid.grid {
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.projects-grid.list {
  grid-template-columns: 1fr;
}

.project-card {
  height: 100%;
  transition: all 0.3s ease;
}

.project-card:hover {
  border-color: var(--secondary-color);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: var(--text-primary);
}

.project-description {
  color: var(--text-regular);
  font-size: 14px;
  line-height: 1.5;
  margin: 15px 0;
}

.project-tech {
  margin: 15px 0;
}

.tech-label {
  display: block;
  color: var(--text-regular);
  font-size: 13px;
  margin-bottom: 8px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.project-metrics {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  padding: 15px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.dark-mode .project-metrics {
  background: rgba(255, 255, 255, 0.05);
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.metric i {
  color: var(--secondary-color);
  font-size: 18px;
}

.project-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid var(--border-color);
  padding-top: 15px;
}

/* 奖项时间轴 */
.awards-timeline {
  padding: 20px;
}

.award-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.award-card:hover {
  transform: translateX(5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1) !important;
}

.award-card.national {
  border-left: 4px solid var(--danger-color);
}

.award-card.provincial {
  border-left: 4px solid var(--warning-color);
}

.award-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.award-icon {
  font-size: 32px;
}

.award-info {
  flex: 1;
}

.award-info h4 {
  margin: 0 0 5px 0;
  color: var(--text-primary);
}

.award-organization {
  color: var(--text-regular);
  font-size: 13px;
  margin: 0;
}

.award-level {
  align-self: flex-start;
}

.award-content {
  margin: 15px 0;
}

.award-content p {
  color: var(--text-regular);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.award-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.award-actions {
  text-align: right;
  border-top: 1px solid var(--border-color);
  padding-top: 15px;
}

/* 联系区域 */
.contact-section {
  margin: 40px 0;
}

.contact-card {
  background: linear-gradient(135deg, var(--card-bg) 0%, rgba(160, 82, 45, 0.05) 100%);
  border: none;
  border-radius: 20px;
  padding: 30px;
}

.contact-card h3 {
  color: var(--text-primary);
  font-size: 24px;
  margin-bottom: 10px;
}

.contact-card p {
  color: var(--text-regular);
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 25px;
}

.contact-methods {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.contact-method {
  flex: 1;
  min-width: 140px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.contact-method:hover {
  background: rgba(160, 82, 45, 0.1);
  border-color: var(--secondary-color);
  transform: translateY(-3px);
}

.qr-code-section {
  text-align: center;
}

.qr-code-placeholder {
  width: 150px;
  height: 150px;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0 auto 15px;
  border: 2px dashed var(--border-color);
}

.qr-code-placeholder i {
  font-size: 48px;
  color: var(--secondary-color);
}

.qr-code-placeholder p {
  color: var(--text-regular);
  font-size: 14px;
  margin: 0;
}

.qr-tip {
  color: var(--text-regular);
  font-size: 12px;
  margin: 0;
}

/* 页脚 */
.footer {
  background: var(--card-bg);
  border-top: 1px solid var(--border-color);
  padding: 30px 0;
  margin-top: 40px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
}

.footer-links a {
  color: var(--text-regular);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: var(--secondary-color);
}

.copyright {
  color: var(--text-regular);
  font-size: 14px;
  margin: 10px 0;
}

.tech-stack {
  color: var(--text-regular);
  font-size: 12px;
  opacity: 0.7;
  margin: 5px 0;
}

/* 项目详情弹窗样式 */
.core-project-detail {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.core-project-detail h3 {
  color: var(--primary-color);
  margin: 20px 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 10px;
}

.core-project-detail h3 i {
  color: var(--secondary-color);
}

.core-project-detail h4 {
  color: var(--text-primary);
  margin: 15px 0 10px 0;
  font-size: 16px;
}

.project-overview {
  background: linear-gradient(135deg, rgba(160, 82, 45, 0.05) 0%, rgba(139, 69, 19, 0.02) 100%);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border-left: 4px solid var(--secondary-color);
}

.overview-text {
  line-height: 1.8;
  color: var(--text-regular);
  font-size: 15px;
  margin-bottom: 20px;
  text-align: justify;
}

.project-badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 15px;
}

/* 计算机博弈项目样式 */
.tech-points {
  margin-top: 10px;
}

.tech-point {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
  padding: 10px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tech-point:hover {
  border-color: var(--secondary-color);
  transform: translateX(3px);
}

.tech-point i {
  color: var(--success-color);
  margin-top: 2px;
}

.achievements-list {
  margin-top: 10px;
}

.achievement-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(231, 182, 26, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);
  border-radius: 8px;
  border-left: 4px solid #ffd700;
}

.achievement-item i {
  color: #e6a23c;
  margin-top: 2px;
}

/* 个人作品集项目样式 */
.tech-details {
  margin-top: 10px;
}

.tech-section {
  margin-bottom: 20px;
  padding: 15px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.tech-section h4 {
  margin-top: 0;
  color: var(--primary-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
}

.tech-section p {
  margin: 10px 0 0 0;
  line-height: 1.6;
  color: var(--text-regular);
}

.project-challenges {
  margin: 25px 0;
}

.challenges-content {
  padding: 15px;
  background: linear-gradient(135deg, rgba(102, 194, 58, 0.1) 0%, rgba(67, 160, 71, 0.05) 100%);
  border-radius: 8px;
  border-left: 4px solid var(--success-color);
}

.optimization-list {
  margin-top: 10px;
}

.optimization-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.optimization-item:hover {
  border-color: var(--info-color);
  transform: translateX(3px);
}

.optimization-item i {
  color: var(--info-color);
}

.optimization-summary {
  margin-top: 15px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1) 0%, rgba(47, 85, 151, 0.05) 100%);
  border-radius: 8px;
  border-left: 4px solid var(--info-color);
  font-style: italic;
  color: var(--text-regular);
}

/* 新增：证书查看弹窗样式 */
.certificate-container {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.certificate-image-wrapper {
  position: relative;
  width: 100%;
  min-height: 400px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark-mode .certificate-image-wrapper {
  background-color: #2d3748;
}

.certificate-image {
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.certificate-image:hover {
  transform: scale(1.02);
}

.certificate-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  color: var(--text-primary);
}

.dark-mode .certificate-loading {
  background: rgba(0, 0, 0, 0.8);
  color: var(--text-primary);
}

.certificate-loading i {
  font-size: 40px;
  margin-bottom: 10px;
  color: var(--secondary-color);
}

.no-certificate {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, rgba(160, 82, 45, 0.05) 0%, rgba(139, 69, 19, 0.02) 100%);
  border-radius: 12px;
  border: 2px dashed var(--border-color);
  margin-bottom: 20px;
}

.dark-mode .no-certificate {
  background: linear-gradient(135deg, rgba(160, 82, 45, 0.1) 0%, rgba(139, 69, 19, 0.05) 100%);
}

.no-certificate i {
  font-size: 60px;
  color: var(--secondary-color);
  margin-bottom: 20px;
  display: block;
}

.no-certificate h3 {
  color: var(--text-primary);
  margin-bottom: 10px;
}

.no-certificate p {
  color: var(--text-regular);
  font-size: 14px;
}

.certificate-details {
  margin-top: 20px;
}

.certificate-details >>> .el-descriptions__body {
  background-color: transparent;
}

.certificate-details >>> .el-descriptions__cell {
  padding: 12px 15px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.skill-tag {
  margin: 2px;
}

/* 滚动条美化 */
.core-project-detail::-webkit-scrollbar,
.certificate-container::-webkit-scrollbar {
  width: 6px;
}

.core-project-detail::-webkit-scrollbar-track,
.certificate-container::-webkit-scrollbar-track {
  background: var(--bg-color);
  border-radius: 3px;
}

.core-project-detail::-webkit-scrollbar-thumb,
.certificate-container::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.core-project-detail::-webkit-scrollbar-thumb:hover,
.certificate-container::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-color);
}

/* 暗色主题适配 */
.dark-mode .project-overview {
  background: linear-gradient(135deg, rgba(160, 82, 45, 0.1) 0%, rgba(139, 69, 19, 0.05) 100%);
}

.dark-mode .tech-point,
.dark-mode .tech-section,
.dark-mode .optimization-item {
  background: rgba(255, 255, 255, 0.05);
}

.dark-mode .achievement-item {
  background: linear-gradient(135deg, rgba(231, 182, 26, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%);
}

.dark-mode .challenges-content {
  background: linear-gradient(135deg, rgba(102, 194, 58, 0.2) 0%, rgba(67, 160, 71, 0.1) 100%);
}

.dark-mode .optimization-summary {
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.2) 0%, rgba(47, 85, 151, 0.1) 100%);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .core3d-container {
    flex-direction: column;
  }

  .skills-container {
    flex-direction: column;
  }

  .skills-details {
    min-width: 100%;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0 16px;
  }

  .nav-center {
    display: none;
  }

  .logo-text {
    font-size: 16px;
  }

  .hero-banner {
    padding: 24px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .projects-grid.grid {
    grid-template-columns: 1fr;
  }

  .contact-methods {
    flex-direction: column;
  }

  .contact-method {
    min-width: 100%;
  }

  .certificate-image-wrapper {
    min-height: 300px;
  }

  .certificate-image {
    max-height: 300px;
  }

  .no-certificate {
    padding: 40px 15px;
  }

  .no-certificate i {
    font-size: 40px;
  }
}
</style>
