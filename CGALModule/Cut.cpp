#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Simple_cartesian.h>
#include <CGAL/Delaunay_triangulation_2.h>


#define NULLPOINT3 Point3(999999999,999999999,999999999)  //定义这个数值的点为空点
#define ACCURACYLIMIT 1e-13

typedef CGAL::Exact_predicates_inexact_constructions_kernel K;
typedef K::Point_3 Point3;
typedef K::Point_2 Point2;
typedef K::Plane_3 Plane3;
typedef K::Triangle_3 Triangle3;
typedef K::Intersect_3 Intersect_3;
typedef K::Segment_3 Segment3;
typedef CGAL::Delaunay_triangulation_2<K> Triangulation;

typedef struct {

	int *FList;
	int FN;
	double *PList;
	int PN;
}*VFSTRUCT;

extern "C" _declspec(dllexport)  double _stdcall Cut(double *p, int *f, int pn, int fn, double *m, int *f1, int *f2, int *sides, int* outpn)
{

	int side1 = 0, side2 = 0;   //被切割后两块的 面数*3
	std::vector<Point3> PointList;  //传入的点数组
	std::vector <std::array<int, 3>> FaceList; //传入的面数组

	//定义切割面
	Point3 m1(m[0], m[1], m[2]);
	Point3 m2(m[3], m[4], m[5]);
	Point3 m3(m[6], m[7], m[8]);
	Plane3 plane3 = Plane3(m1, m2, m3);

	std::vector<Point3> NewPointsList3(pn, NULLPOINT3); //将在切割面上的点数组初始化为pn个

	//给点数组PointList赋值
	for (int i = 0; i < pn; i++)
	{
		PointList.push_back(Point3(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]));
	}
	//给面数组FaceList赋值
	for (int i = 0; i < fn; i++)
	{
		FaceList.push_back({ f[i * 3], f[i * 3 + 1], f[i * 3 + 2] });
	}


	//对每个面进行遍历
	for (int i = 0; i < fn; i++)
	{
		std::vector<Point3> pt3n, pt3p, pt3c;  //点的值
		std::vector<int> fcn, fcp, fcc;   //点在PointList中的下标

		//将每个面上的三个点进行分组
		for (int j = 0; j < 3; j++)
		{
			switch (CGAL::orientation(m1, m2, m3, PointList[FaceList[i][j]]))
			{
			case -1:		
				pt3n.push_back(PointList[FaceList[i][j]]);
				fcn.push_back(FaceList[i][j]);
				break;
			case 1:
				pt3p.push_back(PointList[FaceList[i][j]]);
				fcp.push_back(FaceList[i][j]);
				break;
			case 0:
				pt3c.push_back(PointList[FaceList[i][j]]);
				fcc.push_back(FaceList[i][j]);
				NewPointsList3[FaceList[i][j]] = PointList[FaceList[i][j]];
				break;
			}
		}

		/****************下面是对该面进行情况分析*************/

		//面上三个点都在切割面上（两个面重合）时
		if (pt3c.size() == 3)
		{
			f1[side1] = FaceList[i][0];
			side1++;
			f1[side1] = FaceList[i][1];
			side1++;
			f1[side1] = FaceList[i][2];
			side1++;

			f2[side2] = FaceList[i][0];
			side2++;
			f2[side2] = FaceList[i][1];
			side2++;
			f2[side2] = FaceList[i][2];
			side2++;

		}

		//面整体在切割面的n面
		if ((pt3n.size() >= 2 && pt3p.size() == 0) || (pt3n.size() == 1 && pt3c.size() == 2))
		{
			f1[side1] = FaceList[i][0];
			side1++;
			f1[side1] = FaceList[i][1];
			side1++;
			f1[side1] = FaceList[i][2];
			side1++;

		}

		//面整体在切割面的p面
		if ((pt3n.size() == 0 && pt3p.size() >= 2) || (pt3p.size() == 1 && pt3c.size() == 2))
		{
			f2[side2] = FaceList[i][0];
			side2++;
			f2[side2] = FaceList[i][1];
			side2++;
			f2[side2] = FaceList[i][2];
			side2++;
		}

		//面上一个点与切割面重合，另外两个分别在n面与p面
		if (pt3n.size() == 1 && pt3p.size() == 1 && pt3c.size() == 1)
		{
			Triangle3 t = Triangle3(PointList[FaceList[i][0]], PointList[FaceList[i][1]], PointList[FaceList[i][2]]);
			CGAL::cpp11::result_of<Intersect_3(Plane3, Triangle3)>::type result = intersection(plane3, t);
			Segment3* s3 = boost::get<Segment3>(&*result);

			if (pt3c[0] != (Point3)(*s3)[0])
			{
				PointList.push_back((Point3)(*s3)[0]);
				p[PointList.size() * 3 - 3] = ((Point3)(*s3)[0])[0];
				p[PointList.size() * 3 - 2] = ((Point3)(*s3)[0])[1];
				p[PointList.size() * 3 - 1] = ((Point3)(*s3)[0])[2];

				NewPointsList3.push_back((Point3)(*s3)[0]);
			}
			else
			{
				PointList.push_back((Point3)(*s3)[1]);
				p[PointList.size() * 3 - 3] = ((Point3)(*s3)[1])[0];
				p[PointList.size() * 3 - 2] = ((Point3)(*s3)[1])[1];
				p[PointList.size() * 3 - 1] = ((Point3)(*s3)[1])[2];

				NewPointsList3.push_back((Point3)(*s3)[1]);
			}
			f1[side1] = fcn[0];
			side1++;
			f1[side1] = fcc[0];
			side1++;
			f1[side1] = PointList.size() - 1;
			side1++;

			f2[side2] = fcp[0];
			side2++;
			f2[side2] = fcc[0];
			side2++;
			f2[side2] = PointList.size() - 1;
			side2++;
		}

		//两个点在n面，一个点在p面
		if (pt3n.size() == 2 && pt3p.size() == 1)
		{
			Triangle3 t = Triangle3(PointList[FaceList[i][0]], PointList[FaceList[i][1]], PointList[FaceList[i][2]]);
			CGAL::cpp11::result_of<Intersect_3(Plane3, Triangle3)>::type result = intersection(plane3, t);
			Segment3* s3 = boost::get<Segment3>(&*result);

			//求出了两个交点
			PointList.push_back((Point3)(*s3)[0]);
			PointList.push_back((Point3)(*s3)[1]);

			NewPointsList3.push_back((Point3)(*s3)[0]);
			NewPointsList3.push_back((Point3)(*s3)[1]);

			p[PointList.size() * 3 - 6] = ((Point3)(*s3)[0])[0];
			p[PointList.size() * 3 - 5] = ((Point3)(*s3)[0])[1];
			p[PointList.size() * 3 - 4] = ((Point3)(*s3)[0])[2];
			p[PointList.size() * 3 - 3] = ((Point3)(*s3)[1])[0];
			p[PointList.size() * 3 - 2] = ((Point3)(*s3)[1])[1];
			p[PointList.size() * 3 - 1] = ((Point3)(*s3)[1])[2];

			std::vector<Point2> tmpPoints2; //将被切成含有4个点的面中点映射为2D

			if (fabs(PointList[fcn[0]][0] - PointList[PointList.size() - 1][0])< ACCURACYLIMIT &&fabs(PointList[fcn[0]][0] - PointList[PointList.size() - 2][0])<ACCURACYLIMIT)   //假如这个面平行于Y-Z面
			{
				tmpPoints2.push_back(Point2(PointList[fcn[0]][1], PointList[fcn[0]][2]));
				tmpPoints2.push_back(Point2(PointList[PointList.size() - 1][1], PointList[PointList.size() - 1][2]));
				tmpPoints2.push_back(Point2(PointList[PointList.size() - 2][1], PointList[PointList.size() - 2][2]));
				tmpPoints2.push_back(Point2(PointList[fcn[1]][1], PointList[fcn[1]][2]));
			}
			else if (fabs(PointList[fcn[0]][1] - PointList[PointList.size() - 1][1]) < ACCURACYLIMIT && fabs(PointList[fcn[0]][1] - PointList[PointList.size() - 2][1]) < ACCURACYLIMIT) //假如这个面平行于X-Z面
			{
				tmpPoints2.push_back(Point2(PointList[fcn[0]][0], PointList[fcn[0]][2]));
				tmpPoints2.push_back(Point2(PointList[PointList.size() - 1][0], PointList[PointList.size() - 1][2]));
				tmpPoints2.push_back(Point2(PointList[PointList.size() - 2][0], PointList[PointList.size() - 2][2]));
				tmpPoints2.push_back(Point2(PointList[fcn[1]][0], PointList[fcn[1]][2]));
			}
			else        //假如这个面平行于X-Y面或都不平行
			{
				tmpPoints2.push_back(Point2(PointList[fcn[0]][0], PointList[fcn[0]][1]));
				tmpPoints2.push_back(Point2(PointList[PointList.size() - 1][0], PointList[PointList.size() - 1][1]));
				tmpPoints2.push_back(Point2(PointList[PointList.size() - 2][0], PointList[PointList.size() - 2][1]));
				tmpPoints2.push_back(Point2(PointList[fcn[1]][0], PointList[fcn[1]][1]));
			}

			Triangulation T;
			T.insert(tmpPoints2.begin(), tmpPoints2.end());
			Triangulation::Finite_faces_iterator Finite_face_iterator;

			for (Finite_face_iterator = T.finite_faces_begin(); Finite_face_iterator != T.finite_faces_end(); ++Finite_face_iterator)
			{
				Point2 p0 = Point2(T.triangle(Finite_face_iterator).vertex(0));
				Point2 p1 = Point2(T.triangle(Finite_face_iterator).vertex(1));
				Point2 p2 = Point2(T.triangle(Finite_face_iterator).vertex(2));

				std::vector<Point2>::iterator iter;
				int F[3];
				for (iter = tmpPoints2.begin(); iter != tmpPoints2.end(); iter++)
				{
					if (fabs((*iter)[0] - p0[0])< ACCURACYLIMIT && fabs((*iter)[1] - p0[1])< ACCURACYLIMIT)
					{
						switch (std::distance(tmpPoints2.begin(), iter))
						{
						case 0:
							F[0] = fcn[0];
							break;
						case 1:
							F[0] = PointList.size() - 1;
							break;
						case 2:
							F[0] = PointList.size() - 2;
							break;
						case 3:
							F[0] = fcn[1];
							break;
						}
					}
					 if (fabs((*iter)[0] - p1[0])< ACCURACYLIMIT && fabs((*iter)[1] - p1[1])< ACCURACYLIMIT)
					{
						switch (std::distance(tmpPoints2.begin(), iter))
						{
						case 0:
							F[1] = fcn[0];
							break;
						case 1:
							F[1] = PointList.size() - 1;
							break;
						case 2:
							F[1] = PointList.size() - 2;
							break;
						case 3:
							F[1] = fcn[1];
							break;
						}
					}
					 if (fabs((*iter)[0] - p2[0])< ACCURACYLIMIT && fabs((*iter)[1] - p2[1])< ACCURACYLIMIT)
					{
						switch (std::distance(tmpPoints2.begin(), iter))
						{
						case 0:
							F[2] = fcn[0];
							break;
						case 1:
							F[2] = PointList.size() - 1;
							break;
						case 2:
							F[2] = PointList.size() - 2;
							break;
						case 3:
							F[2] = fcn[1];
							break;
						}
					}
				}

				f1[side1] = F[0];
				side1++;
				f1[side1] = F[1];
				side1++;
				f1[side1] = F[2];
				side1++;
			}

			///////////////////

			std::vector<Point2> tmpPoints21;
			Triangulation T1;

			if (fabs(PointList[fcp[0]][0] - PointList[PointList.size() - 1][0]) < ACCURACYLIMIT && fabs(PointList[fcp[0]][0] - PointList[PointList.size() - 2][0]) < ACCURACYLIMIT)
			{
				tmpPoints21.push_back(Point2(PointList[fcp[0]][1], PointList[fcp[0]][2]));
				tmpPoints21.push_back(Point2(PointList[PointList.size() - 1][1], PointList[PointList.size() - 1][2]));
				tmpPoints21.push_back(Point2(PointList[PointList.size() - 2][1], PointList[PointList.size() - 2][2]));
			}
			else if (fabs(PointList[fcp[0]][1] - PointList[PointList.size() - 1][1])< ACCURACYLIMIT && fabs(PointList[fcp[0]][1] - PointList[PointList.size() - 2][1]) < ACCURACYLIMIT)
			{
				tmpPoints21.push_back(Point2(PointList[fcp[0]][0], PointList[fcp[0]][2]));
				tmpPoints21.push_back(Point2(PointList[PointList.size() - 1][0], PointList[PointList.size() - 1][2]));
				tmpPoints21.push_back(Point2(PointList[PointList.size() - 2][0], PointList[PointList.size() - 2][2]));
			}
			else
			{
				tmpPoints21.push_back(Point2(PointList[fcp[0]][0], PointList[fcp[0]][1]));
				tmpPoints21.push_back(Point2(PointList[PointList.size() - 1][0], PointList[PointList.size() - 1][1]));
				tmpPoints21.push_back(Point2(PointList[PointList.size() - 2][0], PointList[PointList.size() - 2][1]));
			}

			T1.insert(tmpPoints21.begin(), tmpPoints21.end());
			Triangulation::Finite_faces_iterator Finite_face_iterator1;


			for (Finite_face_iterator1 = T1.finite_faces_begin(); Finite_face_iterator1 != T1.finite_faces_end(); ++Finite_face_iterator1)
			{
				Point2 p0 = Point2(T1.triangle(Finite_face_iterator1).vertex(0));
				Point2 p1 = Point2(T1.triangle(Finite_face_iterator1).vertex(1));
				Point2 p2 = Point2(T1.triangle(Finite_face_iterator1).vertex(2));

				std::vector<Point2>::iterator iter;
				int F[3];
				for (iter = tmpPoints21.begin(); iter != tmpPoints21.end(); iter++)
				{
					if (fabs((*iter)[0] - p0[0])< ACCURACYLIMIT && fabs((*iter)[1] - p0[1])< ACCURACYLIMIT)
					{
						switch (std::distance(tmpPoints21.begin(), iter))
						{
						case 0:
							F[0] = fcp[0];
							break;
						case 1:
							F[0] = PointList.size() - 1;
							break;
						case 2:
							F[0] = PointList.size() - 2;
							break;

						}
					}
					if (fabs((*iter)[0] - p1[0])< ACCURACYLIMIT && fabs((*iter)[1] - p1[1])< ACCURACYLIMIT)
					{
						switch (std::distance(tmpPoints21.begin(), iter))
						{
						case 0:
							F[1] = fcp[0];
							break;
						case 1:
							F[1] = PointList.size() - 1;
							break;
						case 2:
							F[1] = PointList.size() - 2;
							break;
						}
					}
					if (fabs((*iter)[0] - p2[0])< ACCURACYLIMIT && fabs((*iter)[1] - p2[1])< ACCURACYLIMIT)
					{
						switch (std::distance(tmpPoints21.begin(), iter))
						{
						case 0:
							F[2] = fcp[0];
							break;
						case 1:
							F[2] = PointList.size() - 1;
							break;
						case 2:
							F[2] = PointList.size() - 2;
							break;

						}
					}
				}

				f2[side2] = F[0];
				side2++;
				f2[side2] = F[1];
				side2++;
				f2[side2] = F[2];
				side2++;
			}

		}

		//两个点在p面，一个点在n面
		if (pt3n.size() == 1 && pt3p.size() == 2)
		{
			Triangle3 t = Triangle3(PointList[FaceList[i][0]], PointList[FaceList[i][1]], PointList[FaceList[i][2]]);
			CGAL::cpp11::result_of<Intersect_3(Plane3, Triangle3)>::type result = intersection(plane3, t);
			Segment3* s3 = boost::get<Segment3>(&*result);

			PointList.push_back((Point3)(*s3)[0]);
			PointList.push_back((Point3)(*s3)[1]);

			NewPointsList3.push_back((Point3)(*s3)[0]);
			NewPointsList3.push_back((Point3)(*s3)[1]);

			p[PointList.size() * 3 - 6] = ((Point3)(*s3)[0])[0];
			p[PointList.size() * 3 - 5] = ((Point3)(*s3)[0])[1];
			p[PointList.size() * 3 - 4] = ((Point3)(*s3)[0])[2];
			p[PointList.size() * 3 - 3] = ((Point3)(*s3)[1])[0];
			p[PointList.size() * 3 - 2] = ((Point3)(*s3)[1])[1];
			p[PointList.size() * 3 - 1] = ((Point3)(*s3)[1])[2];

			std::vector<Point2> tmpPoints2;
			
			if (fabs(PointList[fcp[0]][0] - PointList[PointList.size() - 1][0])  < ACCURACYLIMIT && fabs(PointList[fcp[0]][0] - PointList[PointList.size() - 2][0])  < ACCURACYLIMIT)
			{
				tmpPoints2.push_back(Point2(PointList[fcp[0]][1], PointList[fcp[0]][2]));
				tmpPoints2.push_back(Point2(PointList[PointList.size() - 1][1], PointList[PointList.size() - 1][2]));
				tmpPoints2.push_back(Point2(PointList[PointList.size() - 2][1], PointList[PointList.size() - 2][2]));
				tmpPoints2.push_back(Point2(PointList[fcp[1]][1], PointList[fcp[1]][2]));
			}
			else if (fabs(PointList[fcp[0]][1] - PointList[PointList.size() - 1][1]) < ACCURACYLIMIT &&fabs(PointList[fcp[0]][1] - PointList[PointList.size() - 2][1]) < ACCURACYLIMIT)
			{
				tmpPoints2.push_back(Point2(PointList[fcp[0]][0], PointList[fcp[0]][2]));
				tmpPoints2.push_back(Point2(PointList[PointList.size() - 1][0], PointList[PointList.size() - 1][2]));
				tmpPoints2.push_back(Point2(PointList[PointList.size() - 2][0], PointList[PointList.size() - 2][2]));
				tmpPoints2.push_back(Point2(PointList[fcp[1]][0], PointList[fcp[1]][2]));
			}
			else
			{
				tmpPoints2.push_back(Point2(PointList[fcp[0]][0], PointList[fcp[0]][1]));
				tmpPoints2.push_back(Point2(PointList[PointList.size() - 1][0], PointList[PointList.size() - 1][1]));
				tmpPoints2.push_back(Point2(PointList[PointList.size() - 2][0], PointList[PointList.size() - 2][1]));
				tmpPoints2.push_back(Point2(PointList[fcp[1]][0], PointList[fcp[1]][1]));
			}

			Triangulation T;
			T.insert(tmpPoints2.begin(), tmpPoints2.end());
			Triangulation::Finite_faces_iterator Finite_face_iterator;

			for (Finite_face_iterator = T.finite_faces_begin(); Finite_face_iterator != T.finite_faces_end(); ++Finite_face_iterator)
			{
				Point2 p0 = Point2(T.triangle(Finite_face_iterator).vertex(0));
				Point2 p1 = Point2(T.triangle(Finite_face_iterator).vertex(1));
				Point2 p2 = Point2(T.triangle(Finite_face_iterator).vertex(2));

				std::vector<Point2>::iterator iter;
				int F[3]; 
				for (iter = tmpPoints2.begin(); iter != tmpPoints2.end(); iter++)
				{
					if (fabs((*iter)[0] - p0[0])< ACCURACYLIMIT && fabs((*iter)[1] - p0[1])< ACCURACYLIMIT)
					{

						switch (std::distance(tmpPoints2.begin(), iter))
						{
						case 0:
							F[0] = fcp[0];
							break;
						case 1:
							F[0] = PointList.size() - 1;
							break;
						case 2:
							F[0] = PointList.size() - 2;
							break;
						case 3:
							F[0] = fcp[1];
							break;

						}
					}
					if (fabs((*iter)[0] - p1[0])< ACCURACYLIMIT && fabs((*iter)[1] - p1[1])< ACCURACYLIMIT)
					{
	
						switch (std::distance(tmpPoints2.begin(), iter))
						{
						case 0:
							F[1] = fcp[0];
							break;
						case 1:
							F[1] = PointList.size() - 1;
							break;
						case 2:
							F[1] = PointList.size() - 2;
							break;
						case 3:
							F[1] = fcp[1];
							break;

						}
					}
					if (fabs((*iter)[0] - p2[0])< ACCURACYLIMIT && fabs((*iter)[1] - p2[1])< ACCURACYLIMIT)
					{
		
						switch (std::distance(tmpPoints2.begin(), iter))
						{
						case 0:
							F[2] = fcp[0];
							break;
						case 1:
							F[2] = PointList.size() - 1;
							break;
						case 2:
							F[2] = PointList.size() - 2;
							break;
						case 3:
							F[2] = fcp[1];
							break;

						}
					}
					
				}

				f2[side2] = F[0];
				side2++;
				f2[side2] = F[1];
				side2++;
				f2[side2] = F[2];
				side2++;

			}

			////////////////

			std::vector<Point2> tmpPoints21;
			Triangulation T1;

			if (fabs(PointList[fcn[0]][0] - PointList[PointList.size() - 1][0])< ACCURACYLIMIT&& fabs(PointList[fcn[0]][0] - PointList[PointList.size() - 2][0]) < ACCURACYLIMIT)
			{
				tmpPoints21.push_back(Point2(PointList[fcn[0]][1], PointList[fcn[0]][2]));
				tmpPoints21.push_back(Point2(PointList[PointList.size() - 1][1], PointList[PointList.size() - 1][2]));
				tmpPoints21.push_back(Point2(PointList[PointList.size() - 2][1], PointList[PointList.size() - 2][2]));
			}
			else if (fabs(PointList[fcn[0]][1] - PointList[PointList.size() - 1][1]) < ACCURACYLIMIT &&fabs(PointList[fcn[0]][1] - PointList[PointList.size() - 2][1]) < ACCURACYLIMIT)
			{
				tmpPoints21.push_back(Point2(PointList[fcn[0]][0], PointList[fcn[0]][2]));
				tmpPoints21.push_back(Point2(PointList[PointList.size() - 1][0], PointList[PointList.size() - 1][2]));
				tmpPoints21.push_back(Point2(PointList[PointList.size() - 2][0], PointList[PointList.size() - 2][2]));
			}
			else
			{
				tmpPoints21.push_back(Point2(PointList[fcn[0]][0], PointList[fcn[0]][1]));
				tmpPoints21.push_back(Point2(PointList[PointList.size() - 1][0], PointList[PointList.size() - 1][1]));
				tmpPoints21.push_back(Point2(PointList[PointList.size() - 2][0], PointList[PointList.size() - 2][1]));
			}

			T1.insert(tmpPoints21.begin(), tmpPoints21.end());
			Triangulation::Finite_faces_iterator Finite_face_iterator1;


			for (Finite_face_iterator1 = T1.finite_faces_begin(); Finite_face_iterator1 != T1.finite_faces_end(); ++Finite_face_iterator1)
			{
				Point2 p0 = Point2(T1.triangle(Finite_face_iterator1).vertex(0));
				Point2 p1 = Point2(T1.triangle(Finite_face_iterator1).vertex(1));
				Point2 p2 = Point2(T1.triangle(Finite_face_iterator1).vertex(2));

				std::vector<Point2>::iterator iter;
				int F[3];
				for (iter = tmpPoints21.begin(); iter != tmpPoints21.end(); iter++)
				{
					if (fabs((*iter)[0] - p0[0])< ACCURACYLIMIT && fabs((*iter)[1] - p0[1])< ACCURACYLIMIT)
					{
						switch (std::distance(tmpPoints21.begin(), iter))
						{
						case 0:
							F[0] = fcn[0];
							break;
						case 1:
							F[0] = PointList.size() - 1;
							break;
						case 2:
							F[0] = PointList.size() - 2;
							break;

						}
					}
					if (fabs((*iter)[0] - p1[0])< ACCURACYLIMIT && fabs((*iter)[1] - p1[1])< ACCURACYLIMIT)
					{
						switch (std::distance(tmpPoints21.begin(), iter))
						{
						case 0:
							F[1] = fcn[0];
							break;
						case 1:
							F[1] = PointList.size() - 1;
							break;
						case 2:
							F[1] = PointList.size() - 2;
							break;
						}
					}
					if (fabs((*iter)[0] - p2[0]) < ACCURACYLIMIT && fabs((*iter)[1] - p2[1]) < ACCURACYLIMIT)
					{
						switch (std::distance(tmpPoints21.begin(), iter))
						{
						case 0:
							F[2] = fcn[0];
							break;
						case 1:
							F[2] = PointList.size() - 1;
							break;
						case 2:
							F[2] = PointList.size() - 2;
							break;

						}
					}
				}

				f1[side1] = F[0];
				side1++;
				f1[side1] = F[1];
				side1++;
				f1[side1] = F[2];
				side1++;
			}

		}

	}

	std::vector<Point2> NewPointsList2(NewPointsList3.size());

	for (unsigned i = 0; i < NewPointsList3.size(); i++)
	{
		if (NewPointsList3[i] != NULLPOINT3)
		{
			if (fabs(m[0] - m[3]) < ACCURACYLIMIT && fabs(m[0] - m[6]) < ACCURACYLIMIT && fabs(m[3] - m[6]) <ACCURACYLIMIT)
			{
				NewPointsList2.at(i) = Point2(NewPointsList3[i][1], NewPointsList3[i][2]);
			}
			else if (fabs(m[1] - m[4]) < ACCURACYLIMIT && fabs(m[1] - m[7])  < ACCURACYLIMIT && fabs(m[4] - m[7]) < ACCURACYLIMIT)
			{
				NewPointsList2.at(i) = Point2(NewPointsList3[i][0], NewPointsList3[i][2]);
			}
			else
			{
				NewPointsList2.at(i) = Point2(NewPointsList3[i][0], NewPointsList3[i][1]);
			}
		}
	
	}
	std::vector<Point2> tmpPoint2,nullp(1);
	std::vector<Point2>::iterator pit;
	for (pit = NewPointsList2.begin(); pit != NewPointsList2.end(); pit++)
	{
		if (*pit != nullp[0])
		{
			tmpPoint2.push_back(*pit);
		}
	}

	Triangulation TCenter;
	TCenter.insert(tmpPoint2.begin(), tmpPoint2.end());
	Triangulation::Finite_faces_iterator Finite_face_iterator;
	for (Finite_face_iterator = TCenter.finite_faces_begin(); Finite_face_iterator != TCenter.finite_faces_end(); ++Finite_face_iterator)
	{
		Point2 p0 = Point2(TCenter.triangle(Finite_face_iterator).vertex(0));
		Point2 p1 = Point2(TCenter.triangle(Finite_face_iterator).vertex(1));
		Point2 p2 = Point2(TCenter.triangle(Finite_face_iterator).vertex(2));
		
		std::vector<Point2>::iterator iter;
		int F[3];
		int ii = 0;
		for (iter = NewPointsList2.begin(); iter != NewPointsList2.end(); iter++)
		{
			if (*iter!= nullp[0])
			{
				if (fabs((*iter)[0] - p0[0])< ACCURACYLIMIT && fabs((*iter)[1] - p0[1])< ACCURACYLIMIT)
				{
					ii++;
					F[0] = std::distance(NewPointsList2.begin(), iter);
				}
				if (fabs((*iter)[0] - p1[0])< ACCURACYLIMIT && fabs((*iter)[1] - p1[1])< ACCURACYLIMIT)
				{
					ii++;
					F[1] = std::distance(NewPointsList2.begin(), iter);
				}
				if (fabs((*iter)[0] - p2[0])< ACCURACYLIMIT && fabs((*iter)[1] - p2[1])< ACCURACYLIMIT)
				{
					ii++;
					F[2] = std::distance(NewPointsList2.begin(), iter);
				}
			}		
		
		}
		
		if (ii == 2)
		{
			return p1[1];
		}

		f1[side1] = F[0];
		side1++;
		f1[side1] = F[1];
		side1++;
		f1[side1] = F[2];
		side1++;

		f2[side2] = F[0];
		side2++;
		f2[side2] = F[1];
		side2++;
		f2[side2] = F[2];
		side2++;

	}


	sides[0] = side1 / 3;
	sides[1] = side2 / 3;
	outpn[0] = PointList.size();

	return 0;

}
