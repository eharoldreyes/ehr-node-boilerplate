/**
 * Created by eharoldreyes on 3/7/16.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("user", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue:DataTypes.UUIDV1
        },
        email: {
            type: DataTypes.STRING(256),
            allowNull: false,
            unique:true,
            validate:{
                isEmail:true
            }
        },
        password: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING(512),
            allowNull: false
        },
        middleName: {
            type: DataTypes.STRING(128),
            allowNull: true
        },
        lastName: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(16),
            allowNull: false
        },
        sss: {
            type: DataTypes.STRING(12),
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue:false
        },
        birthday: {
            type: DataTypes.DATE,
            allowNull: true
        },
        hiredAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        timestamps: true,
        classMethods: {
            associate: function (models) {
                //User.belongsTo(models.delivery, {
                //    onDelete: "CASCADE",
                //    as: "Delivery",
                //    foreignKey: "delivery_id"
                //});
            }
        }
    });

    return User;
};