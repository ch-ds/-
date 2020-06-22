/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50727
Source Host           : localhost:3306
Source Database       : store

Target Server Type    : MYSQL
Target Server Version : 50727
File Encoding         : 65001

Date: 2020-06-22 10:42:33
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for attribute
-- ----------------------------
DROP TABLE IF EXISTS `attribute`;
CREATE TABLE `attribute` (
  `attr_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `attr_sel` enum('static','dynamic') COLLATE utf8mb4_unicode_ci NOT NULL,
  `attr_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attr_value` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cate_id` bigint(20) NOT NULL,
  PRIMARY KEY (`attr_id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of attribute
-- ----------------------------
INSERT INTO `attribute` VALUES ('1', 'dynamic', '口味', '什锦果冻,乳酸果冻,奥利给口味', '32');
INSERT INTO `attribute` VALUES ('2', 'static', '包装', '箱装,袋装', '32');
INSERT INTO `attribute` VALUES ('3', 'dynamic', '口味', '原味,香辣味,甜味,麻辣味,混合口味', '35');
INSERT INTO `attribute` VALUES ('4', 'static', '类别', '薯片', '35');
INSERT INTO `attribute` VALUES ('5', 'dynamic', '大小', '15g,25g,35g,45g', '32');
INSERT INTO `attribute` VALUES ('11', 'static', '测试属性', '测试属性1', '32');
INSERT INTO `attribute` VALUES ('10', 'dynamic', '测试', 'FFF', '32');
INSERT INTO `attribute` VALUES ('12', 'dynamic', '大萨达', null, '33');
INSERT INTO `attribute` VALUES ('14', 'static', '大萨达', null, '33');
INSERT INTO `attribute` VALUES ('15', 'dynamic', '挺烦的', '打', '33');

-- ----------------------------
-- Table structure for cate
-- ----------------------------
DROP TABLE IF EXISTS `cate`;
CREATE TABLE `cate` (
  `cate_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cate_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cate_leave` bigint(20) NOT NULL,
  `cate_cid` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`cate_id`)
) ENGINE=MyISAM AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of cate
-- ----------------------------
INSERT INTO `cate` VALUES ('1', '休闲食品', '1', null);
INSERT INTO `cate` VALUES ('2', '粮油调味', '1', null);
INSERT INTO `cate` VALUES ('3', '进口食品', '1', null);
INSERT INTO `cate` VALUES ('4', '饮料冲调', '1', null);
INSERT INTO `cate` VALUES ('5', '休闲零食', '2', '1');
INSERT INTO `cate` VALUES ('6', '饼干蛋糕', '2', '1');
INSERT INTO `cate` VALUES ('7', '肉干肉脯', '2', '1');
INSERT INTO `cate` VALUES ('8', '坚果炒货', '2', '1');
INSERT INTO `cate` VALUES ('9', '蜜饯果干', '2', '1');
INSERT INTO `cate` VALUES ('10', '糖果/巧克力', '2', '1');
INSERT INTO `cate` VALUES ('11', '方便食品', '2', '2');
INSERT INTO `cate` VALUES ('12', '饮料蛋糕', '2', '3');
INSERT INTO `cate` VALUES ('13', '休闲零食', '2', '3');
INSERT INTO `cate` VALUES ('14', '冲饮谷物', '2', '4');
INSERT INTO `cate` VALUES ('15', '饮料', '2', '4');
INSERT INTO `cate` VALUES ('16', '牛奶乳品', '2', '4');
INSERT INTO `cate` VALUES ('17', '咖啡/奶茶', '2', '4');
INSERT INTO `cate` VALUES ('18', '成人奶粉', '2', '4');
INSERT INTO `cate` VALUES ('19', '蜂蜜/柚子茶', '2', '4');
INSERT INTO `cate` VALUES ('20', '方便食品', '2', '3');
INSERT INTO `cate` VALUES ('21', '糖果/巧克力', '2', '3');
INSERT INTO `cate` VALUES ('22', '冲调品', '2', '3');
INSERT INTO `cate` VALUES ('23', '牛奶乳品', '2', '3');
INSERT INTO `cate` VALUES ('24', '米面调味', '2', '3');
INSERT INTO `cate` VALUES ('25', '杂粮', '2', '2');
INSERT INTO `cate` VALUES ('26', '南北干货', '2', '2');
INSERT INTO `cate` VALUES ('27', '调味品', '2', '2');
INSERT INTO `cate` VALUES ('28', '烘焙原料', '2', '2');
INSERT INTO `cate` VALUES ('29', '面', '2', '2');
INSERT INTO `cate` VALUES ('30', '米', '2', '2');
INSERT INTO `cate` VALUES ('31', '熟食腊味', '2', '1');
INSERT INTO `cate` VALUES ('32', '果冻布丁FDSF', '3', '5');
INSERT INTO `cate` VALUES ('33', '鸡肉类', '3', '5');
INSERT INTO `cate` VALUES ('34', '菌菇类', '3', '5');
INSERT INTO `cate` VALUES ('35', '膨化食品', '3', '5');
INSERT INTO `cate` VALUES ('36', '豆类制品', '3', '5');
INSERT INTO `cate` VALUES ('37', '饼干', '3', '6');
INSERT INTO `cate` VALUES ('38', '面包', '3', '6');
INSERT INTO `cate` VALUES ('40', '猪肉类', '3', '7');
INSERT INTO `cate` VALUES ('41', '鸡肉类', '3', '7');
INSERT INTO `cate` VALUES ('42', '牛肉类', '3', '7');
INSERT INTO `cate` VALUES ('43', '鸭肉类', '3', '7');
INSERT INTO `cate` VALUES ('44', '夏威夷果', '3', '8');
INSERT INTO `cate` VALUES ('45', '瓜子', '3', '8');
INSERT INTO `cate` VALUES ('46', '杏仁', '3', '8');
INSERT INTO `cate` VALUES ('47', '糖果', '3', '10');
INSERT INTO `cate` VALUES ('49', '巧克力', '3', '10');
INSERT INTO `cate` VALUES ('50', '火神辣条', '3', '5');

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `g_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `g_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `g_price` decimal(10,2) NOT NULL,
  `g_number` int(11) NOT NULL,
  `g_createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`g_id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO `goods` VALUES ('1', '小米锅巴1', '9.90', '100', '2020-06-19 20:34:39');
INSERT INTO `goods` VALUES ('2', '香酥大麻花', '15.90', '200', '2020-06-19 20:37:50');
INSERT INTO `goods` VALUES ('3', '烤面筋', '3.90', '50', '2020-06-19 20:38:11');
INSERT INTO `goods` VALUES ('4', '素食豆腐干', '26.90', '5', '2020-06-19 20:38:29');
INSERT INTO `goods` VALUES ('5', '山楂干', '17.80', '50', '2020-06-19 20:39:07');
INSERT INTO `goods` VALUES ('6', '海苔夹心饼干', '49.90', '20', '2020-06-19 20:39:23');
INSERT INTO `goods` VALUES ('7', '甜辣薄豆干', '17.90', '22', '2020-06-19 20:39:41');
INSERT INTO `goods` VALUES ('8', '泡椒脆笋', '15.00', '20', '2020-06-19 20:40:08');
INSERT INTO `goods` VALUES ('9', '拉面丸子', '13.90', '33', '2020-06-19 20:40:15');
INSERT INTO `goods` VALUES ('10', '马铃薯儿', '15.30', '29', '2020-06-19 20:40:33');
INSERT INTO `goods` VALUES ('11', '山药脆片', '14.00', '323', '2020-06-19 20:40:46');
INSERT INTO `goods` VALUES ('12', '海鲜锅巴', '14.90', '12', '2020-06-19 20:40:59');
INSERT INTO `goods` VALUES ('13', '鹌鹑蛋', '23.90', '24', '2020-06-19 20:41:09');
INSERT INTO `goods` VALUES ('14', '南瓜酥', '9.90', '40', '2020-06-19 20:41:20');
INSERT INTO `goods` VALUES ('19', '测试', '0.00', '0', '2020-06-21 21:23:44');

-- ----------------------------
-- Table structure for rights
-- ----------------------------
DROP TABLE IF EXISTS `rights`;
CREATE TABLE `rights` (
  `p_id` smallint(6) NOT NULL AUTO_INCREMENT,
  `p_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `p_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `p_leave` int(2) NOT NULL,
  `p_pid` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`p_id`)
) ENGINE=MyISAM AUTO_INCREMENT=144 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of rights
-- ----------------------------
INSERT INTO `rights` VALUES ('100', '用户管理', '', '0', null);
INSERT INTO `rights` VALUES ('101', '用户列表', 'users', '1', '100');
INSERT INTO `rights` VALUES ('102', '权限管理', null, '0', null);
INSERT INTO `rights` VALUES ('103', '角色列表', 'roles', '1', '102');
INSERT INTO `rights` VALUES ('104', '权限列表', 'rights', '1', '102');
INSERT INTO `rights` VALUES ('105', '商品管理', null, '0', null);
INSERT INTO `rights` VALUES ('106', '商品列表', 'goods', '1', '105');
INSERT INTO `rights` VALUES ('107', '分类参数', 'params', '1', '105');
INSERT INTO `rights` VALUES ('108', '商品分类', 'categories', '1', '105');
INSERT INTO `rights` VALUES ('109', '订单管理', null, '0', null);
INSERT INTO `rights` VALUES ('110', '订单列表', 'orders', '1', '109');
INSERT INTO `rights` VALUES ('111', '添加用户', null, '2', '101');
INSERT INTO `rights` VALUES ('113', '删除用户', null, '2', '101');
INSERT INTO `rights` VALUES ('114', '更新用户', null, '2', '101');
INSERT INTO `rights` VALUES ('115', '获取用户详情', null, '2', '101');
INSERT INTO `rights` VALUES ('116', '分配用户角色', null, '2', '101');
INSERT INTO `rights` VALUES ('117', '设置管理状态', null, '2', '101');
INSERT INTO `rights` VALUES ('118', '添加角色', null, '2', '103');
INSERT INTO `rights` VALUES ('119', '删除角色', null, '2', '103');
INSERT INTO `rights` VALUES ('120', '获取角色列表', null, '2', '103');
INSERT INTO `rights` VALUES ('121', '获取角色详情', null, '2', '103');
INSERT INTO `rights` VALUES ('122', '更新角色信息', null, '2', '103');
INSERT INTO `rights` VALUES ('123', '更新角色权限', null, '2', '103');
INSERT INTO `rights` VALUES ('124', '查看权限', null, '2', '104');
INSERT INTO `rights` VALUES ('125', '添加商品', null, '2', '106');
INSERT INTO `rights` VALUES ('126', '修改商品', null, '2', '106');
INSERT INTO `rights` VALUES ('127', '删除商品', null, '2', '106');
INSERT INTO `rights` VALUES ('128', '获取商品详情', null, '2', '106');
INSERT INTO `rights` VALUES ('129', '获取参数列表', null, '2', '107');
INSERT INTO `rights` VALUES ('130', '添加参数', null, '2', '107');
INSERT INTO `rights` VALUES ('131', '修改参数', null, '2', '107');
INSERT INTO `rights` VALUES ('132', '添加属性', null, '2', '107');
INSERT INTO `rights` VALUES ('133', '修改属性', null, '2', '107');
INSERT INTO `rights` VALUES ('134', '删除参数', null, '2', '107');
INSERT INTO `rights` VALUES ('135', '删除属性', null, '2', '107');
INSERT INTO `rights` VALUES ('136', '查看商品分类', null, '2', '108');
INSERT INTO `rights` VALUES ('137', '添加分类', null, '2', '108');
INSERT INTO `rights` VALUES ('138', '修改分类', null, '2', '108');
INSERT INTO `rights` VALUES ('139', '删除分类', null, '2', '108');
INSERT INTO `rights` VALUES ('140', '获取分类详情', null, '2', '108');
INSERT INTO `rights` VALUES ('141', '添加订单', null, '2', '110');
INSERT INTO `rights` VALUES ('142', '修改订单', null, '2', '110');
INSERT INTO `rights` VALUES ('143', '获取订单详情', null, '2', '110');

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `r_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `r_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `r_describe` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`r_id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES ('1', '超级管理员1', '拥有一切权限1');
INSERT INTO `roles` VALUES ('2', '管理员', '负责管理项目');
INSERT INTO `roles` VALUES ('14', '21312312', '312312321');
INSERT INTO `roles` VALUES ('3', '普通用户', '普通人员');
INSERT INTO `roles` VALUES ('4', '测试人员', '测试');
INSERT INTO `roles` VALUES ('16', '测试角色', '我是测试角色');
INSERT INTO `roles` VALUES ('17', '123', '12321');

-- ----------------------------
-- Table structure for roles_rights
-- ----------------------------
DROP TABLE IF EXISTS `roles_rights`;
CREATE TABLE `roles_rights` (
  `roles_id` int(11) NOT NULL,
  `rights_id` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of roles_rights
-- ----------------------------
INSERT INTO `roles_rights` VALUES ('1', '118');
INSERT INTO `roles_rights` VALUES ('17', '101');
INSERT INTO `roles_rights` VALUES ('17', '100');
INSERT INTO `roles_rights` VALUES ('2', '124');
INSERT INTO `roles_rights` VALUES ('2', '104');
INSERT INTO `roles_rights` VALUES ('2', '123');
INSERT INTO `roles_rights` VALUES ('2', '122');
INSERT INTO `roles_rights` VALUES ('2', '121');
INSERT INTO `roles_rights` VALUES ('2', '120');
INSERT INTO `roles_rights` VALUES ('2', '119');
INSERT INTO `roles_rights` VALUES ('2', '118');
INSERT INTO `roles_rights` VALUES ('2', '103');
INSERT INTO `roles_rights` VALUES ('2', '102');
INSERT INTO `roles_rights` VALUES ('2', '117');
INSERT INTO `roles_rights` VALUES ('2', '116');
INSERT INTO `roles_rights` VALUES ('2', '115');
INSERT INTO `roles_rights` VALUES ('2', '114');
INSERT INTO `roles_rights` VALUES ('2', '113');
INSERT INTO `roles_rights` VALUES ('16', '108');
INSERT INTO `roles_rights` VALUES ('16', '105');
INSERT INTO `roles_rights` VALUES ('16', '137');
INSERT INTO `roles_rights` VALUES ('16', '136');
INSERT INTO `roles_rights` VALUES ('2', '111');
INSERT INTO `roles_rights` VALUES ('2', '101');
INSERT INTO `roles_rights` VALUES ('1', '103');
INSERT INTO `roles_rights` VALUES ('1', '102');
INSERT INTO `roles_rights` VALUES ('1', '117');
INSERT INTO `roles_rights` VALUES ('1', '116');
INSERT INTO `roles_rights` VALUES ('1', '115');
INSERT INTO `roles_rights` VALUES ('1', '114');
INSERT INTO `roles_rights` VALUES ('2', '100');
INSERT INTO `roles_rights` VALUES ('1', '113');
INSERT INTO `roles_rights` VALUES ('1', '111');
INSERT INTO `roles_rights` VALUES ('1', '101');
INSERT INTO `roles_rights` VALUES ('1', '100');
INSERT INTO `roles_rights` VALUES ('4', '107');
INSERT INTO `roles_rights` VALUES ('4', '105');
INSERT INTO `roles_rights` VALUES ('4', '103');
INSERT INTO `roles_rights` VALUES ('4', '102');
INSERT INTO `roles_rights` VALUES ('4', '101');
INSERT INTO `roles_rights` VALUES ('4', '100');
INSERT INTO `roles_rights` VALUES ('4', '133');
INSERT INTO `roles_rights` VALUES ('4', '124');
INSERT INTO `roles_rights` VALUES ('4', '104');
INSERT INTO `roles_rights` VALUES ('4', '121');
INSERT INTO `roles_rights` VALUES ('4', '115');
INSERT INTO `roles_rights` VALUES ('4', '111');
INSERT INTO `roles_rights` VALUES ('1', '119');
INSERT INTO `roles_rights` VALUES ('1', '120');
INSERT INTO `roles_rights` VALUES ('1', '121');
INSERT INTO `roles_rights` VALUES ('1', '122');
INSERT INTO `roles_rights` VALUES ('1', '123');
INSERT INTO `roles_rights` VALUES ('1', '104');
INSERT INTO `roles_rights` VALUES ('1', '124');
INSERT INTO `roles_rights` VALUES ('1', '105');
INSERT INTO `roles_rights` VALUES ('1', '106');
INSERT INTO `roles_rights` VALUES ('1', '125');
INSERT INTO `roles_rights` VALUES ('1', '126');
INSERT INTO `roles_rights` VALUES ('1', '127');
INSERT INTO `roles_rights` VALUES ('1', '128');
INSERT INTO `roles_rights` VALUES ('1', '107');
INSERT INTO `roles_rights` VALUES ('1', '129');
INSERT INTO `roles_rights` VALUES ('1', '130');
INSERT INTO `roles_rights` VALUES ('1', '131');
INSERT INTO `roles_rights` VALUES ('1', '132');
INSERT INTO `roles_rights` VALUES ('1', '133');
INSERT INTO `roles_rights` VALUES ('1', '134');
INSERT INTO `roles_rights` VALUES ('1', '135');
INSERT INTO `roles_rights` VALUES ('1', '108');
INSERT INTO `roles_rights` VALUES ('1', '136');
INSERT INTO `roles_rights` VALUES ('1', '137');
INSERT INTO `roles_rights` VALUES ('1', '138');
INSERT INTO `roles_rights` VALUES ('1', '139');
INSERT INTO `roles_rights` VALUES ('1', '140');
INSERT INTO `roles_rights` VALUES ('1', '109');
INSERT INTO `roles_rights` VALUES ('1', '110');
INSERT INTO `roles_rights` VALUES ('1', '141');
INSERT INTO `roles_rights` VALUES ('17', '108');
INSERT INTO `roles_rights` VALUES ('17', '105');
INSERT INTO `roles_rights` VALUES ('17', '103');
INSERT INTO `roles_rights` VALUES ('17', '102');
INSERT INTO `roles_rights` VALUES ('17', '140');
INSERT INTO `roles_rights` VALUES ('17', '139');
INSERT INTO `roles_rights` VALUES ('17', '124');
INSERT INTO `roles_rights` VALUES ('17', '104');
INSERT INTO `roles_rights` VALUES ('17', '123');
INSERT INTO `roles_rights` VALUES ('17', '114');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'admin', '123456', '982508293@qq.com', '15112533384', '1');
INSERT INTO `users` VALUES ('2', 'demo', '123456', '269962556@qq.com', '10086', '1');
INSERT INTO `users` VALUES ('3', '张三', '111222333', '9825@qq.com', '19999', '0');
INSERT INTO `users` VALUES ('6', '何泽鸿', 'wswswsws', '911@qq.com', '15112533888', '1');
INSERT INTO `users` VALUES ('7', '何泽鸿', 'wswswsws', '911@qq.com', '15112533888', '1');
INSERT INTO `users` VALUES ('8', '黄威林', 'osososos', '22@qq.com', '15112533385', '1');
INSERT INTO `users` VALUES ('30', '  罗浩龙', '123456', '22@qq.com', '15112533385', '1');
INSERT INTO `users` VALUES ('31', '小河人', '242421321', '43@qq.com', '15112533385', '1');

-- ----------------------------
-- Table structure for users_roles
-- ----------------------------
DROP TABLE IF EXISTS `users_roles`;
CREATE TABLE `users_roles` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL DEFAULT '3',
  PRIMARY KEY (`user_id`,`role_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of users_roles
-- ----------------------------
INSERT INTO `users_roles` VALUES ('0', '3');
INSERT INTO `users_roles` VALUES ('1', '1');
INSERT INTO `users_roles` VALUES ('2', '3');
INSERT INTO `users_roles` VALUES ('3', '2');
INSERT INTO `users_roles` VALUES ('6', '3');
INSERT INTO `users_roles` VALUES ('7', '3');
INSERT INTO `users_roles` VALUES ('8', '3');
INSERT INTO `users_roles` VALUES ('30', '2');
INSERT INTO `users_roles` VALUES ('31', '4');
INSERT INTO `users_roles` VALUES ('33', '3');
INSERT INTO `users_roles` VALUES ('34', '3');
INSERT INTO `users_roles` VALUES ('35', '3');
