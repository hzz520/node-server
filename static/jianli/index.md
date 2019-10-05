
<style>
    * {
        padding: 0;
        margin: 0;
        line-height: 1;
        color: #333;
    }
    .title {
        font-size: 25px;
        color: #000;
        font-weight: 500;
        text-align: center;
        line-height: 80px;
        border-bottom: 1px solid #ddd;
    }
    .subtitle {
        padding: 15px 10px;
        background: #CECECE;
        margin: 15px 0;
        font-size: 18px;
        color: #333;
        font-weight: bolder;
    }

    .content {
        font-size: 0;
    }

    .content p
        {
        width: 50%;
        display: inline-block;
        font-weight:normal;
        color: #333;
        font-size: 15px;
        line-height: 35px;
        padding-left: 10px;
        box-sizing: border-box;
    }

    .comps .desc {
        color: #333;
        font-size: 15px;
        line-height: 35px;
        padding-left: 10px;
        box-sizing: border-box;
        margin-bottom: 10px;
    }

    .comps .tit,
    .comps .content.tit p,
    .comps .desc {
        font-weight: 500;
    }

    .project {
        margin-bottom: 20px;
    }

    .project:not(:last-of-type) {
        padding-bottom: 30px;
        border-bottom: 1px dashed #ddd;
    }

    .project .item {
        background: #efefef;
        padding: 10px;
        font-size: 15px;
    }

    .project .item:not(:last-of-type) {
        margin-bottom: 30px;
    }

    .project .item > div,
    .project .item > div .right {
        vertical-align: top;
        line-height: 30px;
        font-size: 15px;
    }
    .project .item > div .right {
        display: inline-block;
    }
    .project .item > div .right p {
        line-height: 30px;
    }

    .up {
        padding: 10px;
        background: #efefef;
    }

    .up,
    .up .item,
    .up .skills p  {
        font-size: 15px;
        line-height: 30px;
    }
    .up .item a {
        color: blue;
    }

    .judge {
        padding: 10px;
        background: #efefef;
    }
    .judge p {
        line-height: 30px;
    }
</style>

<div class="title">web前端工程师</div>
<div class="subtitle">基本信息</div>
<div class="content jibenxinxi">
	<p>姓名：黄忠贞</p>
    <p>性别：男</p>
    <p>籍贯：江西吉安</p>
    <p>学历：大学本科</p>
    <p>出生年月：1992年2月</p>
    <p>现住地址：天通苑西一区</p>
    <p>联系电话：18612213010</p>
    <p>电子邮件：1013452861@qq.com</p>
    <p>毕业学院：长春工业大学</p>
</div>
<div class="subtitle">教育情况</div>
<div class="content jiaoyuqingkuang">
    <p>2011年9月-2015年7月</p>
    <p>长春工业大学</p>
</div>
<div class="subtitle">工作项目经历</div>
<div class="comps">
    <div class="content tit">
        <p>2018年5月-至今</p>
        <p>北京城市网邻信息技术有限公司</p>
    </div>
    <div class='desc'>【工作描述】：58app租房发布业务 | 安居客app租房发布业务 | 58app租房保障 | 58商铺小程序 | 其他（运营活动）</div>
    <div class="project">   
        <div class="item">
            <div class='item-title'>项目一介绍：</div>
            <div class='item-name'>项目名称：58同城app租房发布</div>
            <div class="item-skills">
            	<span>技术要点：</span>
            	<div class="right">
            		<p>1.node中间层：express + velocity + typescript</p>
                    <p>2.前端资源：vue+native协议，使用charles抓包并且代理资源进行开发</p>
                    </div>
            </div>
            <div class="item-duty">项目职责：58app租房发布业务开发与维护（包括页面模版，前端js，css两个方面）</div>
        </div>
        <div class="item">
            <div class='item-title'>项目二介绍：</div>
            <div class='item-name'>项目名称：安居客app租房发布</div>
            <div class="item-skills">
            	<span>技术要点：</span>
            	<div class="right">
            		<p>1.node中间层：express + velocity + typescript</p>
                    <p>2.前端资源：vue+native协议，使用charles抓包并且代理资源进行开发</p>
                    </div>
            </div>
            <div class="item-duty">项目职责：安居客app租房发布业务开发与维护（包括页面模版，前端js，css两个方面）</div>
        </div>
        <div class="item">
            <div class='item-title'>项目三介绍：</div>
            <div class='item-name'>项目名称：58app租房保障</div>
            <div class="item-skills">
            	<span>技术要点：</span>
            	<div class="right">
            		<p>1.node中间层：express + velocity + typescript</p>
                    <p>2.前端资源：vue+typescript+vue-router+vuex+native协议，使用charles抓包并且代理资源进行开发</p>
                    </div>
            </div>
            <div class="item-duty">项目职责：58app租房保障业务开发与维护（包括页面模版，前端js，css两个方面）</div>
        </div>
        <div class="item">
            <div class='item-title'>项目四介绍：</div>
            <div class='item-name'>项目名称：58商铺小程序</div>
            <div class="item-skills">
            	<span>技术要点：</span>
            	<div class="right">
            		<p>使用mpvue进行开发，与流行前端开发方式统一，降低开发与维护成本</p>
                    </div>
            </div>
            <div class="item-duty">项目职责：58商铺小程序开发与维护</div>
        </div>
    </div>
    <div class="content tit">
        <p>2016年8月-2018年4月</p>
        <p>蓝港互动有限公司</p>
    </div>
    <div class='desc'>【工作描述】：火星财经官网，音浪官网开发，音浪app webview开发</div>
    <div class="project">
        <div class="item">
            <div class='item-title'>项目一介绍：</div>
            <div class='item-name'>项目名称：火星财经</div>
            <div class="item-skills">
            	<span>技术要点：</span>
            	<div class="right">
            		<p>使用react+redux+webpack进行开发</p>
                    </div>
            </div>
            <div class="item-duty">项目职责：火星财经官网单页应用的开发与维护</div>
        </div>
        <div class="item">
            <div class='item-title'>项目二介绍：</div>
            <div class='item-name'>项目名称：小青生活馆</div>
            <div class="item-skills">
            	<span>技术要点：</span>
            	<div class="right">
            		<p>使用微信小程序原生api开发</p>
                    </div>
            </div>
            <div class="item-duty">项目职责：负责商城的搭建和维护</div>
        </div>
    </div>
</div>
<div class="subtitle">技术成长</div>
<div class="up">
    <div class="item">
    github：<a href="https://github.com/hzz520">https://github.com/hzz520</a>
    </div>
    <div class="item">
    自建站点：<a href="https://hzz.letin2586.com">https://hzz.letin2586.com</a>
    </div>
    <div class="skills">
        <p>1. nginx路由分发</p>
        <p>2. https证书安装</p>
        <p>3. mongodb服务搭建</p>
        <p>4. typescript + express + mongoose 后端服务搭建</p>
        <p>5. react + redux + webpack 构建前端页面资源</p>
        <p>6.egret web开发初尝试</p>
        <p>7.centos 搭建git服务器设置免密</p>
        <p>8.centos 搭建ftp服务</p>
        <p>9.github webhook自动部署</p>
        <p>10.简单shell脚本的编写</p>
        <p>11.使用md2html2pdf命令行通过makedown写简历</p>
    </div>
</div>
<div class="subtitle">自我评价</div>
<div class="judge">
    <p>1.有较强的学习力，能够适应前端的变化，热爱前端技术。</p>
    <p>2.自我管理能力强，具备良好的执行力，能够很好的与同事进行沟通，实现产品和设计同事提出的功能需求</p>
</div>
