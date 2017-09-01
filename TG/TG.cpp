// test.cpp : 定义 DLL 应用程序的导出函数。
//

#include "stdafx.h"
#pragma pack(push)
#pragma pack(1)

typedef struct {

	int *FList;
	int FN;
	double *PList;
	int PN;
}*VFSTRUCT;

#pragma pack(pop)

extern "C" _declspec(dllexport)  int _stdcall ReVF(double* plist, int* flist, int pn, int fn, VFSTRUCT outstruct)
{

	tetgenio in, out;
	tetgenio::facet *f;
	tetgenio::polygon *p;

	in.firstnumber = 1;
	in.numberofpoints = pn;
	in.pointlist = new REAL[in.numberofpoints * 3];
	for (int i = 0; i < in.numberofpoints * 3; i++)
	{
		in.pointlist[i] = plist[i];
	}

	in.numberoffacets = fn;
	in.facetlist = new tetgenio::facet[in.numberoffacets];
	//in.facetmarkerlist = new int[in.numberoffacets];

	for (int i = 0; i < in.numberoffacets; i++)
	{
		f = &in.facetlist[i];
		f->numberofpolygons = 1;
		f->polygonlist = new tetgenio::polygon[f->numberofpolygons];
		f->numberofholes = 0;
		f->holelist = NULL;
		p = &f->polygonlist[0];
		p->numberofvertices = 3;
		p->vertexlist = new int[p->numberofvertices];
		p->vertexlist[0] = flist[i * 3];
		p->vertexlist[1] = flist[i * 3 + 1];
		p->vertexlist[2] = flist[i * 3 + 2];

		//in.facetmarkerlist[i] = 0;

	}
	tetrahedralize("pq1.414a200", &in, &out);
//	tetrahedralize("p", &in, &out);
	outstruct->FN = out.numberoftrifaces;
	outstruct->PN = out.numberofpoints;

	
	for (int i = 0; i < out.numberoftrifaces * 3; i++)
	{
		flist[i] = out.trifacelist[i];
	}
	outstruct->FList = flist;

	for (int i = 0; i < out.numberofpoints * 3; i++)
	{
		plist[i] = out.pointlist[i];
	}
	outstruct->PList = plist;
	
	return out.numberoftrifaces;

}

