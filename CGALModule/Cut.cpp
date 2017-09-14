#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Simple_cartesian.h>

typedef CGAL::Exact_predicates_inexact_constructions_kernel K;
typedef K::Point_3 Point3;
typedef K::Plane_3 Plane3;
typedef K::Triangle_3 Triangle3;
typedef K::Intersect_3 Intersect_3;
typedef K::Segment_3 Segment3;

typedef struct {

	int *FList;
	int FN;
	double *PList;
	int PN;
}*VFSTRUCT;

extern "C" _declspec(dllexport)  double _stdcall Cut(double *p, int *f, int pn, int fn, double *m, int *f1, int *f2,int *sides,int* outpn)
{

	int side1 = 0, side2 = 0;
	//Point3 *PointList = new Point3[pn];
	std::vector<Point3> PointList;
	//	int(*FaceList)[3] = new int[fn][3];
	std::vector <std::array<int,3>> FaceList;
	Point3 m1(m[0], m[1], m[2]);
	Point3 m2(m[3], m[4], m[5]);
	Point3 m3(m[6], m[7], m[8]);
	Plane3 plane3 = Plane3(m1,m2,m3);

	for (int i = 0; i < pn; i++)
	{
		PointList.push_back(Point3(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]));
	}

	for (int i = 0; i < fn; i++)
	{
		FaceList.push_back({ f[i * 3], f[i * 3 + 1], f[i * 3 + 2] });
	}


	//将每一个面进行分组
	for (int i = 0; i < fn; i++)
	{
		std::vector<Point3> pt3n, pt3p, pt3c;
		std::vector<int> fcn, fcp, fcc;
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
				break;
			}
		}
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

		if ((pt3n.size() >= 2 && pt3p.size() == 0) || (pt3n.size() == 1 && pt3c.size() == 2))
		{
			f1[side1] = FaceList[i][0];
			side1++;
			f1[side1] = FaceList[i][1];
			side1++;
			f1[side1] = FaceList[i][2];
			side1++;
		}
		if ((pt3n.size() == 0 && pt3p.size() >= 2) || (pt3p.size() == 1 && pt3c.size() == 2))
		{
			f2[side2] = FaceList[i][0];
			side2++;
			f2[side2] = FaceList[i][1];
			side2++;
			f2[side2] = FaceList[i][2];
			side2++;
		}
		if (pt3n.size() == 1 && pt3p.size() == 1 && pt3c.size() == 1)
		{
			Triangle3 t = Triangle3(PointList[FaceList[i][0]], PointList[FaceList[i][1]], PointList[FaceList[i][2]]);
			CGAL::cpp11::result_of<Intersect_3(Plane3, Triangle3)>::type result = intersection(plane3, t);
			Segment3* s3 = boost::get<Segment3>(&*result);

			if (pt3c[0] != (Point3)(*s3)[0])
			{
				PointList.push_back((Point3)(*s3)[0]);
				p[PointList.size()*3-3] = ((Point3)(*s3)[0])[0];
				p[PointList.size()*3-2] = ((Point3)(*s3)[0])[1];
				p[PointList.size()*3-1] = ((Point3)(*s3)[0])[2];
			}
			else
			{
				PointList.push_back((Point3)(*s3)[1]);
				p[PointList.size()*3-3] = ((Point3)(*s3)[1])[0];
				p[PointList.size()*3-2] = ((Point3)(*s3)[1])[1];
				p[PointList.size()*3-1] = ((Point3)(*s3)[1])[2];
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
		if (pt3n.size() == 2 && pt3p.size() == 1)
		{
			Triangle3 t = Triangle3(PointList[FaceList[i][0]], PointList[FaceList[i][1]], PointList[FaceList[i][2]]);
			CGAL::cpp11::result_of<Intersect_3(Plane3, Triangle3)>::type result = intersection(plane3, t);
			Segment3* s3 = boost::get<Segment3>(&*result);
			PointList.push_back((Point3)(*s3)[0]);
			PointList.push_back((Point3)(*s3)[1]);

			p[PointList.size() * 3 - 6] = ((Point3)(*s3)[0])[0];
			p[PointList.size() * 3 - 5] = ((Point3)(*s3)[0])[1];
			p[PointList.size() * 3 - 4] = ((Point3)(*s3)[0])[2];
			p[PointList.size() * 3 - 3] = ((Point3)(*s3)[1])[0];
			p[PointList.size() * 3 - 2] = ((Point3)(*s3)[1])[1];
			p[PointList.size() * 3 - 1] = ((Point3)(*s3)[1])[2];

			f1[side1] = fcn[0];
			side1++;
			f1[side1] = PointList.size() - 2;
			side1++;
			f1[side1] = PointList.size() - 1;
			side1++;
			f1[side1] = fcn[1];
			side1++;
			f1[side1] = fcn[0];
			side1++;
			f1[side1] = PointList.size() - 1;
			side1++;

			f2[side2] = PointList.size() - 2;
			side2++;
			f2[side2] = PointList.size() - 1;
			side2++;
			f2[side2] = fcp[0];
			side2++;
		}
		if (pt3n.size() == 1 && pt3p.size() == 2)
		{
			Triangle3 t = Triangle3(PointList[FaceList[i][0]], PointList[FaceList[i][1]], PointList[FaceList[i][2]]);
			CGAL::cpp11::result_of<Intersect_3(Plane3, Triangle3)>::type result = intersection(plane3, t);
			Segment3* s3 = boost::get<Segment3>(&*result);
			PointList.push_back((Point3)(*s3)[0]);
			PointList.push_back((Point3)(*s3)[1]);

			p[PointList.size() * 3 - 6] = ((Point3)(*s3)[0])[0];
			p[PointList.size() * 3 - 5] = ((Point3)(*s3)[0])[1];
			p[PointList.size() * 3 - 4] = ((Point3)(*s3)[0])[2];
			p[PointList.size() * 3 - 3] = ((Point3)(*s3)[1])[0];
			p[PointList.size() * 3 - 2] = ((Point3)(*s3)[1])[1];
			p[PointList.size() * 3 - 1] = ((Point3)(*s3)[1])[2];

			f1[side1] = PointList.size() - 2;
			side1++;
			f1[side1] = PointList.size() - 1;
			side1++;
			f1[side1] = fcn[0];
			side1++;

			f2[side2] = fcp[0];
			side2++;
			f2[side2] = PointList.size() - 2;
			side2++;
			f2[side2] = PointList.size() - 1;
			side2++;
			f2[side2] = fcp[1];
			side2++;
			f2[side2] = fcp[0];
			side2++;
			f2[side2] = PointList.size() - 1;
			side2++;

		}

		
	}
	sides[0] = side1/3;
	sides[1] = side2/3;
	outpn[0] = PointList.size();
	
	return 13;
	
}