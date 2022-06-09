echo "Removing Prisma files to reduce the layer size"
find .aws-sam/build/PrismaLayer/nodejs/node_modules/.prisma/client/libquery_engine-* ! -name *rhel* -exec rm -rf {} \;
find .aws-sam/build/PrismaLayer/nodejs/node_modules/prisma/libquery_engine-* ! -name *rhel* -exec rm -rf {} \;
rm -rf .aws-sam/build/PrismaLayer/nodejs/node_modules/@prisma/engines